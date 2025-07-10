'use client';

import {
    addToast,
    Autocomplete,
    AutocompleteItem,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Form,
    Input,
    Tab,
    Tabs,
    Textarea,
} from '@heroui/react';
import { FormEvent, useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { languages } from '@/data/languages';
import { QUERY_KEYS } from '@/enums/queryKeys';
import { useNavigation } from '@/hooks/useNavigation';
import { createNewPost, Post } from '@/services/PostService';

export function CreatePost() {
    const [selectedPostType, setSelectedPostType] = useState('text');
    const queryClient = useQueryClient();
    const { navigateToPost } = useNavigation();

    const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data: Post = Object.fromEntries(new FormData(e.currentTarget));

        //for some reason, the autocomplete component from HeroUI returns the label instead of the key, therefore need to set it manually
        data.language = getLanguageKey(data.language);

        createNewPost(data)
            .then((postId) => {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.posts] }).then(() => navigateToPost(postId));
            })
            .catch((error) => {
                addToast({ title: 'Failed to create post', description: error.message, color: 'danger' });
            });

        e.currentTarget?.reset();
    }, []);

    const getLanguageKey = useCallback(
        (label?: string) => {
            if (label) {
                const selectedLanguage = languages.find((language) => language.label === label);

                return selectedLanguage ? selectedLanguage.key : label;
            } else {
                return '';
            }
        },
        [languages],
    );

    return (
        <div className='mb-4'>
            <Card className='w-full border-primary border-1 p-2'>
                <Form onSubmit={(e) => handleSubmit(e)}>
                    <CardHeader className='justify-between px-3'>
                        <div className='text-2xl font-extrabold leading-none tracking-tight text-gray-800'>
                            Share New Post
                        </div>
                    </CardHeader>
                    <CardBody className='px-3 text-small text-default-600'>
                        <Tabs
                            aria-label='Options'
                            color='primary'
                            selectedKey={selectedPostType}
                            onSelectionChange={(key) => setSelectedPostType(key.toString())}
                        >
                            <Tab key='text' id='shareTextTab' title='Share Text'>
                                <Textarea
                                    errorMessage='Please enter a text'
                                    id='postTextContent'
                                    isRequired={selectedPostType === 'text'}
                                    label='Your Post'
                                    minRows={4}
                                    name='content'
                                    placeholder='What are you thinking?'
                                />
                            </Tab>
                            <Tab key='url' id='shareUrlTab' title='Share URL'>
                                <Input
                                    className='pb-2'
                                    id='postUrl'
                                    isRequired={selectedPostType === 'url'}
                                    label='URL'
                                    name='url'
                                    placeholder='Enter URL...'
                                />
                                <Autocomplete
                                    allowsCustomValue
                                    defaultItems={languages}
                                    id='postLanguage'
                                    label='Preferred Language'
                                    name='language'
                                    variant='bordered'
                                >
                                    {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                                </Autocomplete>
                            </Tab>
                            <Tab key='image' id='shareImageTab' title='Share Image'>
                                <Input
                                    className='pb-2'
                                    id='postImageUrl'
                                    isRequired={selectedPostType === 'image'}
                                    label='Image URL'
                                    name='imageUrl'
                                    placeholder='Please enter a link to an Image...'
                                />
                                <Input
                                    id='postImageDescription'
                                    label='Description'
                                    name='content'
                                    placeholder='Enter a description...'
                                />
                            </Tab>
                        </Tabs>
                    </CardBody>
                    <CardFooter className='gap-3 justify-start px-3'>
                        <div className='flex gap-1'>
                            <Button color='primary' name='createPostSubmit' type='submit'>
                                <p>Post</p>
                            </Button>
                        </div>
                    </CardFooter>
                </Form>
            </Card>
        </div>
    );
}
