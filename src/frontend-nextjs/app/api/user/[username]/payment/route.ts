import { NextResponse } from 'next/server';

import { fetchUserIdForUsername } from '@/services/api/AuthService';
import { fetchPaymentDataOfUser, updatePaymentDataForUser } from '@/services/api/PaymentService';
import { UserParams } from '@/app/api/user/[username]/bio/route';

/**
 * @swagger
 * /ui/api/user/{username}/payment:
 *   get:
 *     description: Get the payment data for a user by username.
 *   post:
 *     description: Update the payment data for a user by username.
 */

export async function GET(req: Request, { params }: { params: Promise<UserParams> }): Promise<NextResponse> {
    const { username } = await params;
    const userId = await fetchUserIdForUsername(username);
    const paymentResponse = await fetchPaymentDataOfUser(userId);

    return NextResponse.json(paymentResponse.data, { status: paymentResponse.status });
}

export async function POST(req: Request, { params }: { params: Promise<UserParams> }): Promise<NextResponse> {
    const { username } = await params;
    const body = await req.json();

    const userId = await fetchUserIdForUsername(username);
    const paymentResponse = await updatePaymentDataForUser(body, userId);

    return NextResponse.json(paymentResponse.data, { status: paymentResponse.status });
}
