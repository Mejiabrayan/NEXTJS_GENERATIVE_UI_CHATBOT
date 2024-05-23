import { Skeleton } from './ui/skeleton';
const LoadingSkeleton = () => {
  return (
    <div className='space-y-2'>
      <Skeleton className='h-4 w-[250px] bg-slate-400' />
      <Skeleton className='h-4 w-[200px] bg-slate-400' />
    </div>
  );
};

export default LoadingSkeleton;
