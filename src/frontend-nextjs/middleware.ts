import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

import { ROUTES } from '@/enums/routes';
import { BASE_PATH } from '@/constants';

const protectedRoutes = [
    ROUTES.users,
    ROUTES.mytimeline,
    ROUTES.post,
    ROUTES.payment,
    ROUTES.membership_plans,
    ROUTES.ad_manager,
];

export function middleware(req: NextRequest) {
    const jwt = req.cookies.get('jwt')?.value;

    const isProtected =
        protectedRoutes.includes(<ROUTES>req.nextUrl.pathname) || req.nextUrl.pathname.startsWith('/user/');

    if (!jwt && isProtected) {
        return NextResponse.redirect(new URL(BASE_PATH + ROUTES.login, req.url));
    }

    if (jwt) {
        try {
            jwtDecode(jwt);
        } catch {
            req.cookies.delete('jwt');

            return NextResponse.redirect(new URL(BASE_PATH + ROUTES.login, req.url));
        }
    }

    return NextResponse.next();
}
