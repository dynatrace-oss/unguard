import { NextResponse } from 'next/server';

import { addSpamPredictionUserRatingDownvote } from '@/services/api/SpamPredictionVotesService';

/**
 * @swagger
 * /ui/api/post/{postId}/spam-prediction-user-rating/downvote:
 *   post:
 *     description: Downvote the Spam Prediction.
 */

export type PostParams = {
    postId: string;
};

export async function POST(req: Request, { params }: { params: Promise<PostParams> }): Promise<NextResponse> {
    const { postId } = await params;
    const res = await addSpamPredictionUserRatingDownvote(postId);

    return NextResponse.json(res.data, { status: res.status });
}
