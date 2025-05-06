import { Timeline } from '@/components/Timeline';
import { Ad } from '@/components/Ad';
import { CreatePost } from '@/components/CreatePost';
import { isLoggedIn } from '@/helpers/isLoggedIn';

export default async function Home() {
    return (
        <div>
            <h1 className='mb-6 text-4xl font-extrabold leading-none tracking-tight text-gray-800'>Timeline</h1>
            <div className='grid gap-8 grid-cols-[70%_30%] min-h-screen'>
                <div>
                    {(await isLoggedIn()) && <CreatePost />}
                    <Timeline />
                </div>
                <Ad />
            </div>
        </div>
    );
}
