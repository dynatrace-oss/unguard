import { Timeline } from '@/components/Timeline';
import { Ad } from '@/components/Ad';

export default function Home() {
    return (
        <div>
            <h1 className='mb-6 text-4xl font-extrabold leading-none tracking-tight text-gray-800'>Timeline</h1>
            <div className='grid gap-16 grid-cols-[70%_30%] min-h-screen'>
                <Timeline />
                <Ad />
            </div>
        </div>
    );
}
