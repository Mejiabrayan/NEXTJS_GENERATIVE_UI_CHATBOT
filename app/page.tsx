'use client';
import { useState } from 'react';
import { ClientMessage } from '../lib/chat/actions';
import { useActions, useUIState } from 'ai/rsc';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Bot } from 'lucide-react';
import { IconOpenAI, IconUser } from '@/components/ui/icons';

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();

  return (
    <div className="h-full container mx-auto w-full max-w-xl py-8">
      <div className="rounded-lg  border border-black/10 p-6 mb-6">
        {conversation.map((message: ClientMessage) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg mb-2 flex items-start gap-2 ${
              message.role === 'user'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-slate-100 text-gray-800'
            }`}
          >
            {message.role === 'user' ? (
              <IconOpenAI scale={'10'} className="mt-1" />
            ) : (
              <IconUser scale={'10'} className="mt-1" />
            )}
            {message.display}
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setInput('');
            setConversation((currentConversation: ClientMessage[]) => [
              ...currentConversation,
              { id: nanoid(), role: 'user', display: input },
            ]);
            const message = await continueConversation(input);
            setConversation((currentConversation: ClientMessage[]) => [
              ...currentConversation,
              message,
            ]);
          }}
          className="w-full"
        >
          <div className="flex gap-2">
            <Input
              type="text"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
              }}
              placeholder="Type your message..."
              className="flex-grow rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
            />
            <Button variant={'default'}>
              Send Message
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}