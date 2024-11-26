import {
  Document,
  OpenAI,
  ContextChatEngine,
  VectorStoreIndex,
  ChatMessage,
  MessageContent
} from 'llamaindex';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { OpenAIRequest } from './types';
import { ChatModel } from 'openai/resources/index.mjs';
import { findRelevantContent } from './embedding';
import { getSystemPrompt } from '@/lib/prompt';
import { env } from '@/lib/env.mjs';

const createEnqueueContent = (
  relevantContent: Array<{ name: string; similarity: number }>,
  aiResponse: string
) => {
  const data = {
    relevantContent: relevantContent || [],
    aiResponse: aiResponse || ''
  };

  return new TextEncoder().encode(`event: message\ndata: ${JSON.stringify(data)}\n\n`);
};

export async function POST(req: Request) {
  const request: OpenAIRequest = await req.json();
  const { messages } = request;

  try {
    // 初始化 LlamaIndex OpenAI
    const llm = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      baseURL: env.OPENAI_BASE_URL,
      model: (env.MODEL as ChatModel) || 'gpt-4',
      maxTokens: 4096,
      ...(env.HTTP_AGENT ? { httpAgent: new HttpsProxyAgent(env.HTTP_AGENT) } : {})
    });

    const lastMessage = messages[messages.length - 1];
    const lastMessageContentString = Array.isArray(lastMessage.content)
      ? lastMessage.content.map((c) => (c.type === 'text' ? c.text : '')).join('')
      : (lastMessage.content as string);

    // 获取相关内容并创建文档
    const relevantContent = await findRelevantContent(lastMessageContentString);
    const documents = relevantContent.map((content) => new Document({ text: content.name }));

    // 创建索引和聊天引擎
    const index = await VectorStoreIndex.fromDocuments(documents);
    const chatEngine = new ContextChatEngine({
      retriever: index.asRetriever({
        similarityTopK: 5
      }),
      chatModel: llm,
      systemPrompt: getSystemPrompt(relevantContent.map((c) => c.name).join('\n'))
    });

    const userMessage = messages.pop();

    // 创建流式响应
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await chatEngine.chat({
            message: userMessage?.content as MessageContent,
            chatHistory: messages as ChatMessage<object>[],
            stream: true
          });

          for await (const chunk of response) {
            controller.enqueue(createEnqueueContent(relevantContent, chunk?.delta || ''));
          }
        } catch (err) {
          console.error('Stream error:', err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
      cancel() {
        console.log('Stream cancelled');
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      }
    });
  } catch (error: unknown) {
    console.error('error catch', error);
    if (error instanceof Error) {
      return new Response(error.message, { status: 400, statusText: 'Bad Request' });
    }
    return new Response('An unknown error occurred', { status: 400, statusText: 'Bad Request' });
  }
}
