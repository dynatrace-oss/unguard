import { User } from '@/components/UsersView/User';

interface FollowerListProps {
    followers: { userId: string; userName: string }[] | undefined;
}

export function FollowerList(props: FollowerListProps) {
    return (
        <div>
            {!props.followers || props.followers?.length === 0
                ? 'No users found...'
                : props.followers?.map((user: { userId: string; userName: string }, index: number) => (
                      <div key={index}>
                          <User roles={[]} userId={user.userId} username={user.userName} />
                      </div>
                  ))}
        </div>
    );
}
