import React, { useState } from 'react';
import { Input } from '@heroui/react';

export function ExpirationDateInput(props: any) {
    const [value, setValue] = useState(props.value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let input = e.target.value.replace(/[^0-9/]/g, '');

        if (input.indexOf('/') !== -1) {
            const [mm, rest] = input.split('/');

            input = mm.slice(0, 2) + '/' + rest.replace(/\//g, '').slice(0, 2);
        }

        if (!input.includes('/') && input.length > 2) {
            input = input.slice(0, 2) + '/' + input.slice(2, 4);
        }

        if (input.length > 5) input = input.slice(0, 5);

        setValue(input);
    };

    return (
        <Input
            {...props}
            pattern='^(0[1-9]|1[0-2])/[0-9]{2}$'
            placeholder='MM/YY'
            type='text'
            value={value}
            onChange={handleChange}
        />
    );
}
