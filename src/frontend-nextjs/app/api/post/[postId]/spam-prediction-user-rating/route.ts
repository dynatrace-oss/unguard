import { NextResponse } from 'next/server';

import { fetchSpamPredictionUserRating } from '@/services/api/SpamPredictionVotesService';
import { PostParams } from '@/app/api/like/[postId]/route';

/**
 * @swagger
 * /ui/api/post/{postId}/spam-prediction-user-rating:
 *   get:
 *     description: Get the spam prediction user ratings for a post by its ID.
 */

export async function GET(req: Request, { params }: { params: Promise<PostParams> }): Promise<NextResponse> {
    const { postId } = await params;
    const res = await fetchSpamPredictionUserRating(postId);

    return NextResponse.json(res.data);
}
