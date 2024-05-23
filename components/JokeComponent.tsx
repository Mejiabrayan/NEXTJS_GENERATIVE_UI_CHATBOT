'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Joke } from '@/core/generate-object';

export const JokeComponent = ({ joke }: { joke?: Joke }) => {
  const [showPunchline, setShowPunchline] = useState(false);

  const togglePunchline = () => {
    setShowPunchline((prevState) => !prevState);
  };

  return (
    <div className=' rounded-lg p-4 mx-auto max-w-md'>
      <p className='text-base  mb-4'>
        {showPunchline ? joke?.punchline : joke?.setup}
      </p>
      <Button variant={'default'} onClick={togglePunchline}>
        {showPunchline ? 'Show Setup' : 'Show Punchline'}
      </Button>
    </div>
  );
};
