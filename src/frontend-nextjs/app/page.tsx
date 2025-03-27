import Timeline from '@/components/Timeline';
import AdComponent from '@/components/AdComponent';

export default function Home() {
    return (
        <div className='grid gap-16 grid-cols-[70%_30%]'>
            <Timeline />
            <AdComponent />
        </div>
    );
}
