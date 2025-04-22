'use client';
import { Button, Switch, Textarea } from '@heroui/react';
import { useState } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import MDEditor, { commands } from '@uiw/react-md-editor';
import { useQueryClient } from '@tanstack/react-query';

import { useBio } from '@/hooks/useBio';

interface BioEditorProps {
    username: string;
}

const markdownCommands = [
    commands.bold,
    commands.italic,
    commands.title,
    commands.title2,
    commands.title3,
    commands.title4,
    commands.title5,
    commands.title6,
];

async function updateBio(username: string, data: { bioText: string; enableMarkdown: boolean }): Promise<Response> {
    return await fetch(`/ui/api/user/${username}/bio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}

export function BioEditor({ username }: BioEditorProps) {
    const [isMarkdownEditor, setIsMarkdownEditor] = useState(false);
    const { data: bio } = useBio(username);
    const [value, setValue] = useState(bio || '');
    const queryClient = useQueryClient();

    return (
        <div className='pt-10 p-2 align-items-stretch'>
            <h2 className='mb-6 text-2xl font-extrabold leading-none tracking-tight text-gray-800'>Edit Bio</h2>
            <Switch className='mb-2' color='primary' isSelected={isMarkdownEditor} onValueChange={setIsMarkdownEditor}>
                Use Markdown Editor
            </Switch>
            {!isMarkdownEditor && (
                <Textarea label='Bio' minRows={8} placeholder='Enter your bio' value={value} onValueChange={setValue} />
            )}
            {isMarkdownEditor && (
                <MDEditor
                    commands={markdownCommands}
                    extraCommands={[]}
                    minHeight={120}
                    preview='live'
                    value={value}
                    onChange={(val) => setValue(val || '')}
                />
            )}
            <Button
                className='mt-2'
                color='primary'
                onPress={() =>
                    updateBio(username, { bioText: value, enableMarkdown: isMarkdownEditor }).then(() =>
                        queryClient.invalidateQueries({ queryKey: [`bio-${username}`] }),
                    )
                }
            >
                Edit Bio
            </Button>
        </div>
    );
}
