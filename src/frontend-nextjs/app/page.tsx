import Timeline from '@/components/Timeline';
import AdComponent from '@/components/AdComponent';

export default function Home() {
    return (
        <div>
            <h1 className='mb-6 text-4xl font-extrabold leading-none tracking-tight text-gray-800'>Timeline</h1>
            <div className='grid gap-16 grid-cols-[70%_30%] min-h-screen'>
                <Timeline />
                <AdComponent />
            </div>
        </div>
    );
}
