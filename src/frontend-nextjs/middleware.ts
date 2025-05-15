import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { addBasePath } from 'next/dist/client/add-base-path';

import { ROUTES } from '@/enums/routes';

const protectedRoutes = [ROUTES.users, ROUTES.mytimeline, ROUTES.post];

export function middleware(req: NextRequest) {
    const jwt = req.cookies.get('jwt')?.value;

    const isProtected =
        protectedRoutes.includes(<ROUTES>req.nextUrl.pathname) || req.nextUrl.pathname.startsWith('/user/');

    if (!jwt && isProtected) {
        return NextResponse.redirect(new URL(addBasePath('/login'), req.url));
    }

    if (jwt) {
        try {
            jwtDecode(jwt);
        } catch {
            req.cookies.delete('jwt');

            return NextResponse.redirect(new URL(addBasePath('/login'), req.url));
        }
    }

    return NextResponse.next();
}
