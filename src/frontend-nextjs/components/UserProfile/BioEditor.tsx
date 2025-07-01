'use client';
import { Accordion, AccordionItem, Button, Switch, Textarea } from '@heroui/react';
import { useState } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import MDEditor, { commands } from '@uiw/react-md-editor';
import { useQueryClient } from '@tanstack/react-query';
import { BsPencil } from 'react-icons/bs';

import { updateBio } from '@/services/BioService';
import { useBio } from '@/hooks/queries/useBio';
import { QUERY_KEYS } from '@/enums/queryKeys';

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

export function BioEditor({ username }: BioEditorProps) {
    const [isMarkdownEditor, setIsMarkdownEditor] = useState(false);
    const { data: bio } = useBio(username);
    const [value, setValue] = useState(bio || '');
    const queryClient = useQueryClient();

    return (
        <Accordion className='mt-6 align-items-stretch' defaultExpandedKeys={['theme']} variant='shadow'>
            <AccordionItem
                key='editBio'
                aria-label='Edit Bio'
                id='editBio'
                indicator={<BsPencil />}
                title={<p className='text-xl font-extrabold tracking-tight text-gray-800'>Edit Bio</p>}
            >
                <Switch
                    className='mb-2'
                    color='primary'
                    id='useMarkdownEditorSwitch'
                    isSelected={isMarkdownEditor}
                    onValueChange={setIsMarkdownEditor}
                >
                    Use Markdown Editor
                </Switch>
                {isMarkdownEditor ? (
                    <MDEditor
                        commands={markdownCommands}
                        extraCommands={[]}
                        id='bioTextMarkdown'
                        minHeight={120}
                        preview='live'
                        value={value}
                        onChange={(val) => setValue(val || '')}
                    />
                ) : (
                    <Textarea
                        id='bioText'
                        label='Bio'
                        minRows={8}
                        placeholder='Enter your bio'
                        value={value}
                        onValueChange={setValue}
                    />
                )}
                <Button
                    className='mt-2'
                    color='primary'
                    name='postBio'
                    onPress={() =>
                        updateBio(username, { bioText: value, enableMarkdown: isMarkdownEditor }).then(() =>
                            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.bio, username] }),
                        )
                    }
                >
                    Edit Bio
                </Button>
            </AccordionItem>
        </Accordion>
    );
}
