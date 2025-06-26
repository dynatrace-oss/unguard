'use client';
import { Link } from '@heroui/react';

import { DeploymentStatus } from '@/components/Footer/DeploymentStatus';

export function Footer() {
    return (
        <div>
            <p>Powered by Unguard.</p>
            <p>
                Robots lovingly delivered by <Link href='https://robohash.org/'>Robohash.org</Link>
            </p>
            <DeploymentStatus />
        </div>
    );
}
