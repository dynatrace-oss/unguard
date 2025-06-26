import { Ad } from '@/components/Ad';
import { UserSearch } from '@/components/UsersView/UserSearch';

export default function Users() {
    return (
        <div>
            <h1 className='mb-6 text-4xl font-extrabold leading-none tracking-tight text-gray-800'>Users</h1>
            <div className='grid gap-8 grid-cols-[70%_30%]'>
                <UserSearch />
                <Ad />
            </div>
        </div>
    );
}
