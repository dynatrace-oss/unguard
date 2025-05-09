'use client';

import {
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
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { languages } from '@/data/languages';
import { ROUTES } from '@/enums/routes';

interface Post {
    content?: string;
    url?: string;
    imageUrl?: string;
    language?: string;
}

async function post(data: Post) {
    const res = await fetch('ui/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    return res.json();
}
export function CreatePost() {
    const [selectedPostType, setSelectedPostType] = useState('text');
    const queryClient = useQueryClient();
    const router = useRouter();

    return (
        <div className='mb-4'>
            <Card className='w-full border-primary border-1 p-2'>
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const data: Post = Object.fromEntries(new FormData(e.currentTarget));

                        //for some reason, the autocomplete component from HeroUI returns the label instead of the key, therefore need to set it manually
                        if (data.language) {
                            const selectedLanguage = languages.find((language) => language.label === data.language);

                            data.language = selectedLanguage ? selectedLanguage.key : data.language;
                        }

                        post(data).then((postId) => {
                            queryClient.invalidateQueries({ queryKey: ['posts'] });
                            router.push(ROUTES.post + '?id=' + postId);
                        });

                        e.currentTarget?.reset();
                    }}
                >
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
                            <Tab key='text' title='Share Text'>
                                <Textarea
                                    errorMessage='Please enter a text'
                                    isRequired={selectedPostType === 'text'}
                                    label='Your Post'
                                    minRows={4}
                                    name='content'
                                    placeholder='What are you thinking?'
                                />
                            </Tab>
                            <Tab key='url' title='Share URL'>
                                <Input
                                    className='pb-2'
                                    errorMessage='Please enter a valid URL'
                                    isRequired={selectedPostType === 'url'}
                                    label='URL'
                                    name='url'
                                    placeholder='Enter URL...'
                                    type='url'
                                />
                                <Autocomplete
                                    allowsCustomValue
                                    defaultItems={languages}
                                    label='Preferred Language'
                                    name='language'
                                    variant='bordered'
                                >
                                    {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                                </Autocomplete>
                            </Tab>
                            <Tab key='image' title='Share Image'>
                                <Input
                                    className='pb-2'
                                    errorMessage='Please enter a valid URL'
                                    isRequired={selectedPostType === 'image'}
                                    label='Image URL'
                                    name='imageUrl'
                                    placeholder='Please enter a link to an Image...'
                                    type='url'
                                />
                                <Input label='Description' name='content' placeholder='Enter a description...' />
                            </Tab>
                        </Tabs>
                    </CardBody>
                    <CardFooter className='gap-3 justify-start px-3'>
                        <div className='flex gap-1'>
                            <Button color='primary' type='submit'>
                                <p>Post</p>
                            </Button>
                        </div>
                    </CardFooter>
                </Form>
            </Card>
        </div>
    );
}
