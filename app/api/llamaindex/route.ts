import { OpenAI, ContextChatEngine, ChatMessage, MessageContent } from 'llamaindex';
import { OpenAIRequest } from './types';
import { ChatModel } from 'openai/resources/index.mjs';
import { findRelevantContent } from './embedding';
import { getSystemPrompt } from '@/lib/prompt';
import { env } from '@/lib/env.mjs';
import { createRetriever } from './embedding';

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
      model: (env.MODEL as ChatModel) || 'gpt-4',
      maxTokens: 4096,
      additionalSessionOptions: {
        baseURL: env.OPENAI_BASE_URL
      }
    });

    const lastMessage = messages[messages.length - 1];
    const lastMessageContentString = Array.isArray(lastMessage.content)
      ? lastMessage.content.map((c) => (c.type === 'text' ? c.text : '')).join('')
      : (lastMessage.content as string);

    // TODO: 直接从retriever中获取相关内容
    const relevantContent = await findRelevantContent(lastMessageContentString);

    // 创建索引和聊天引擎
    const retriever = await createRetriever();
    const chatEngine = new ContextChatEngine({
      retriever,
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
