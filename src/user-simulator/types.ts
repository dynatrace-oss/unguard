/*
Copyright 2023 Dynatrace LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

export type User = {
    username: string
    password: string
}

export type UrlPosts = {
    posts: UrlPost[]
}

export type UrlPost = {
    url: string;
    language: string;
}

export type ImageUrlPosts = {
    posts: ImageUrlPost[]
}

export type ImageUrlPost = {
    url: string;
    text: string;
}

export type TextPosts = {
    posts: TextPost[]
}

export type TextPost = {
    text: string
}

export type BioList = {
    bioList: Bio[]
}

export type Bio = {
    text: string,
    isMarkdown: boolean
}

export type Config = {
    frontendUrl: string
}
