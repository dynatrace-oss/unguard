import { NextResponse } from 'next/server';

import { fetchUserIdForUsername } from '@/services/api/AuthService';
import { fetchPaymentDataOfUser, updatePaymentDataForUser } from '@/services/api/PaymentService';
import { UserParams } from '@/app/api/user/[username]/bio/route';

export async function GET(req: Request, { params }: { params: Promise<UserParams> }): Promise<NextResponse> {
    const { username } = await params;
    const userId = await fetchUserIdForUsername(username);
    const res_payment = await fetchPaymentDataOfUser(userId);

    return NextResponse.json(res_payment.data, { status: res_payment.status });
}

export async function POST(req: Request, { params }: { params: Promise<UserParams> }): Promise<NextResponse> {
    const { username } = await params;
    const body = await req.json();

    const userId = await fetchUserIdForUsername(username);
    const res_payment = await updatePaymentDataForUser(body, userId);

    return NextResponse.json(res_payment.data, { status: res_payment.status });
}
