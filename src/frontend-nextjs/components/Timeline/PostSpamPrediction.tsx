import React from 'react';
import {Alert} from "@heroui/react";

export interface PostSpamPredictionProps {
    isSpamPredictedLabel?: boolean | null;
}



export function PostSpamPrediction(props: Readonly<PostSpamPredictionProps>) {
    console.log("PostSpamPrediction props:", props);
    if (props.isSpamPredictedLabel == null) return null;


    if (props.isSpamPredictedLabel) {
        const color='danger'
        return (
            <div key={color} className='w-full flex items-center my-3'>
                <div>
                    <Alert color={color} title={'Potential Spam Detected'} />
                </div>
            </div>
        );
    }

    const color = 'primary'
    return (
        <div key={color} className='w-full flex items-center my-3'>
            <div>
                <Alert color={color} title={'No Spam Detected'} />
            </div>
        </div>
    );
}
