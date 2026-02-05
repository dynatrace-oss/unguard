import {getMicroblogApi} from '@/axios';
import {getJwtFromCookie} from '@/services/api/AuthService';
import type {AxiosRequestConfig} from 'axios';
import {AxiosHeaders} from 'axios';

async function withJwtCookie(): Promise<AxiosRequestConfig> {
    const jwt = await getJwtFromCookie();

    const headers = new AxiosHeaders();
    headers.set('Cookie', `jwt=${jwt}`);

    return {headers};
}

export async function fetchSpamPredictionUserRating(postId: string): Promise<any> {
    return await getMicroblogApi()
        .get(`/spam-prediction-user-rating/${postId}`, await withJwtCookie())
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
}

export async function addSpamPredictionUserRatingUpvote(postId: string): Promise<any> {
    return await getMicroblogApi()
        .post(`/spam-prediction-user-rating/${postId}/upvote/`, {}, await withJwtCookie())
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
}

export async function addSpamPredictionUserRatingDownvote(postId: string): Promise<any> {
    return await getMicroblogApi()
        .post(`/spam-prediction-user-rating/${postId}/downvote/`, {}, await withJwtCookie())
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
}
