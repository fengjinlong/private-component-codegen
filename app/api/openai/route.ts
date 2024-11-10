import OpenAI from 'openai';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { OpenAIRequest } from './types';
import { ChatModel } from 'openai/resources/index.mjs';
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

    const result = openai.chat.completions.create({
      model: (process.env.MODEL as ChatModel) || 'gpt-4o',
      stream: true,
      messages: [
        {
          role: 'system',
          content: '你是一个万能助手，可以回答任何问题。'
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
