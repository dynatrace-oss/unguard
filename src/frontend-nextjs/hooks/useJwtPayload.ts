import { useQuery } from '@tanstack/react-query';

async function fetchJwtPayload() {
    const res = await fetch('/ui/api/auth/jwt-payload', { method: 'GET' });

    if (!res.ok) {
        throw new Error('Failed to fetch JWT');
    }

    return res.json();
}

export function useJwtPayload() {
    return useQuery({
        queryKey: ['jwtPayload'],
        queryFn: fetchJwtPayload,
    });
}
