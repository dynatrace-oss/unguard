import { useQuery } from '@tanstack/react-query';

async function fetchAd() {
    const res = await fetch('/ui/api/ad');

    if (!res.ok) {
        throw new Error('Failed to fetch ad');
    }

    return res.json();
}

export function useAd() {
    return useQuery({
        queryKey: ['ad'],
        queryFn: fetchAd,
    });
}
