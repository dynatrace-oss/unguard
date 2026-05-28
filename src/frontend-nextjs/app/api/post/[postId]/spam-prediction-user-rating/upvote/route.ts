import { NextResponse } from 'next/server';

import { addSpamPredictionUserRatingUpvote } from '@/services/api/SpamPredictionVotesService';

/**
 * @swagger
 * /ui/api/post/{postId}/spam-prediction-user-rating/upvote:
 *   post:
 *     description: Handle spam prediction upvote action
 */

export type PostParams = {
    postId: string;
};

export async function POST(req: Request, { params }: { params: Promise<PostParams> }): Promise<NextResponse> {
    const { postId } = await params;
    const res = await addSpamPredictionUserRatingUpvote(postId);

    return NextResponse.json(res.data, { status: res.status });
}
