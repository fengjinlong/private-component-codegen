import OpenAI from 'openai';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { OpenAIRequest } from './types';
import { ChatModel } from 'openai/resources/index.mjs';
import { findRelevantContent } from './embedding';
import { getSystemPrompt } from '@/lib/prompt';

export async function POST(req: Request) {
  const apiKey = req.headers.get('apiKey');
  const baseURL = req.headers.get('baseURL');

  const request: OpenAIRequest = await req.json();
  const { messages } = request;

  try {
    const openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
      baseURL: baseURL || process.env.OPENAI_BASE_URL,
      ...(process.env.HTTP_AGENT ? { httpAgent: new HttpsProxyAgent(process.env.HTTP_AGENT) } : {})
    });

    const lastMessage = messages[messages.length - 1];

    const lastMessageContentString =
      Array.isArray(lastMessage.content) && lastMessage.content.length > 0
        ? lastMessage.content.map((c) => (c.type === 'text' ? c.text : '')).join('')
        : (lastMessage.content as string);

    const relevantContent = await findRelevantContent(lastMessageContentString);

    const result = openai.chat.completions.create({
      model: (process.env.MODEL as ChatModel) || 'gpt-4o',
      stream: true,
      messages: [
        {
          role: 'system',
          content: getSystemPrompt(relevantContent.map((c) => c.name).join('\n'))
        },
        ...messages
      ]
    });

    await result.catch((error) => {
      throw error;
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of await result) {
            controller.enqueue(new TextEncoder().encode(chunk?.choices?.[0]?.delta?.content || ''));
            controller.enqueue(
              chunk?.choices?.[0]?.delta?.tool_calls?.[0]?.function?.arguments || ''
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

    return new Response(stream);
  } catch (error: unknown) {
    console.error('error catch', error);
    if (error instanceof Error) {
      return new Response(error.message, { status: 400, statusText: 'Bad Request' });
    }
    return new Response('An unknown error occurred', { status: 400, statusText: 'Bad Request' });
  }
}
