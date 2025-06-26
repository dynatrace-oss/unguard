import { Ad } from '@/components/Ad';
import { CreatePost } from '@/components/CreatePost';
import { GlobalTimeline } from '@/components/GlobalTimeline';
import { isLoggedIn } from '@/services/LocalUserService';

export default async function Home() {
    return (
        <div>
            <h1 className='mb-6 text-4xl font-extrabold leading-none tracking-tight text-gray-800'>Timeline</h1>
            <div className='grid gap-8 grid-cols-[70%_30%]'>
                <div>
                    {(await isLoggedIn()) && <CreatePost />}
                    <GlobalTimeline />
                </div>
                <Ad />
            </div>
        </div>
    );
}
