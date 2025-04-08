import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

import { ROUTES } from '@/app/enums/routes';

const protectedRoutes = [ROUTES.users, ROUTES.mytimeline];

export function middleware(req: NextRequest) {
    const jwt = req.cookies.get('jwt')?.value;

    if (!jwt && protectedRoutes.includes(<ROUTES>req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/ui/login', req.url));
    }

    if (jwt) {
        try {
            jwtDecode(jwt);
        } catch (e) {
            return NextResponse.redirect(new URL('/ui/login', req.url));
        }
    }

    return NextResponse.next();
}
