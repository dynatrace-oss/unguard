import { useQuery } from '@tanstack/react-query';

async function fetchIsLoggedIn() {
    const res = await fetch('/ui/api/auth/login', { method: 'GET' });

    if (!res.ok) {
        throw new Error('Failed to fetch login status');
    }

    return res.json();
}

export function useCheckLogin() {
    return useQuery({
        queryKey: ['isLoggedIn'],
        queryFn: fetchIsLoggedIn,
    });
}
