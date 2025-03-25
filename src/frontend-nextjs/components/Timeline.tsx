import { Spacer } from "@heroui/react";

import PostComponent from "@/components/PostComponent";
import { PostProps } from "@/components/PostComponent";

export default function Timeline() {
    const list: PostProps[] = [
        {
            name: "Name",
            timestamp: "timestamp",
            text: "text",
            likes: 0,
            avatar_url: "https://heroui.com/avatars/avatar-1.png",
        },
        {
            name: "Name2",
            timestamp: "timestamp2",
            text: "text2",
            likes: 1,
            avatar_url: "https://heroui.com/avatars/avatar-1.png",
        },
        {
            name: "Name3",
            timestamp: "timestamp3",
            text: "text3",
            likes: 2,
            avatar_url: "https://heroui.com/avatars/avatar-1.png",
        },
        {
            name: "Name4",
            timestamp: "timestamp4",
            text: "text4",
            likes: 3,
            avatar_url: "https://heroui.com/avatars/avatar-1.png",
        },
    ];

    const listOfPosts = list.map((post, index) => (
        <div key={index}>
            <PostComponent
                avatar_url={post.avatar_url}
                likes={post.likes}
                name={post.name}
                text={post.text}
                timestamp={post.timestamp}
            />
            <Spacer y={2} />
        </div>
    ));

    return <div>{listOfPosts}</div>;
}
