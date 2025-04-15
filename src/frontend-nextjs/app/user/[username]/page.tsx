import { ProfileHeader } from '@/components/ProfileHeader';

export default async function UserProfile({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    return (
        <div>
            <ProfileHeader username={username} />
        </div>
    );
}
