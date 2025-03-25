'use client';
import { Card, Image } from '@heroui/react';

export default function AdComponent() {
  return (
    <div>
      <Card>
        <Image
          removeWrapper
          alt='Card background'
          className='z-0 w-full h-full object-cover'
          src='https://heroui.com/images/card-example-4.jpeg'
        />
      </Card>
    </div>
  );
}
