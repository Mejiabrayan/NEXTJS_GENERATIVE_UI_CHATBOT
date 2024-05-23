'use server';

import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { ReactNode } from 'react';
import { createAI, getMutableAIState, streamUI } from 'ai/rsc';
import { generateObject, nanoid } from 'ai';
import { jokeSchema } from '@/core/generate-object';
import { JokeComponent } from '@/components/JokeComponent';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export interface ServerMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClientMessage {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
}

export async function continueConversation(
  input: string
): Promise<ClientMessage> {
  'use server';

  const history = getMutableAIState();

  const result = await streamUI({
    model: openai('gpt-4o'),
    messages: [...history.get(), { role: 'user', content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: 'assistant', content },
        ]);
      }

      return <div>{content}</div>;
    },
    tools: {
      tellAJoke: {
        description: 'Tell a joke',
        parameters: z.object({
          city: z.string().describe('the users city'),
        }),
        generate: async function* ({ city }) {
          yield <LoadingSkeleton />;
          const joke = await generateObject({
            model: openai('gpt-4o'),
            schema: jokeSchema,
            prompt:
              'Generate a joke that incorporates the following city:' + city,
          });
          return <JokeComponent joke={joke.object} />;
        },
      },
    },
  });

  return {
    id: nanoid(),
    role: 'assistant',
    display: result.value,
  };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});
