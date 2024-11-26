import { ChatOpenAI } from '@langchain/openai';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { OpenAIRequest } from './types';
import { findRelevantContent } from './embedding';
import { getSystemPrompt } from '@/lib/prompt';
import { env } from '@/lib/env.mjs';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';

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
    const chat = new ChatOpenAI({
      openAIApiKey: env.OPENAI_API_KEY,
      configuration: {
        baseURL: env.OPENAI_BASE_URL,
        ...(env.HTTP_AGENT ? { httpAgent: new HttpsProxyAgent(env.HTTP_AGENT) } : {})
      },
      modelName: env.MODEL || 'gpt-4',
      maxTokens: 4096,
      streaming: true
    });

    const lastMessage = messages[messages.length - 1];
    const lastMessageContentString =
      Array.isArray(lastMessage.content) && lastMessage.content.length > 0
        ? lastMessage.content.map((c) => (c.type === 'text' ? c.text : '')).join('')
        : (lastMessage.content as string);

    const relevantContent = await findRelevantContent(lastMessageContentString);

    const langChainMessages = messages.map((msg) => {
      switch (msg.role) {
        case 'system':
          return new SystemMessage(msg.content as string);
        case 'assistant':
          return new AIMessage(msg.content as string);
        default:
          return new HumanMessage(msg.content as string);
      }
    });

    // 添加系统提示
    langChainMessages.unshift(
      new SystemMessage(getSystemPrompt(relevantContent.map((c) => c.name).join('\n')))
    );

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const stream = await chat.stream(langChainMessages);

          for await (const chunk of stream) {
            controller.enqueue(
              createEnqueueContent(
                relevantContent,
                typeof chunk.content === 'string' ? chunk.content : String(chunk.content)
              )
            );
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
