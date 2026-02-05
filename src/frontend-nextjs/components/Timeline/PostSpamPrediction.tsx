'use client';

import React from 'react';
import {Alert} from "@heroui/react";

import {SpamPredictionUserRating} from "@/components/Timeline/SpamPredictionUserRating";
import {useCheckLogin} from "@/hooks/queries/useCheckLogin";
import {ErrorBoundary} from "react-error-boundary";
import {ErrorCard} from "@/components/ErrorCard";

export interface PostSpamPredictionProps {
    isSpamPredictedLabel?: boolean | null;
    postId: string;
}

export function PostSpamPrediction(props: Readonly<PostSpamPredictionProps>) {
    const { isLoggedIn } = useCheckLogin();
    if (props.isSpamPredictedLabel == null) return null;

    const color = props.isSpamPredictedLabel ? 'danger' : 'primary';

    return (
        <div key={color} className='w-full flex items-center my-3'>
            <div className="w-full">
                <Alert color={color}>
                    <div className="flex w-full items-center justify-between gap-3">
                        <div className="font-semibold">{props.isSpamPredictedLabel? "Potential Spam Detected" : "No Spam Detected"}</div>
                        {isLoggedIn && (
                            <ErrorBoundary fallbackRender={(props) => <ErrorCard message={props.error.message} />}>
                                <SpamPredictionUserRating isSpamPredictedLabel={props.isSpamPredictedLabel} postId={props.postId} />
                            </ErrorBoundary>
                        )}
                    </div>
                </Alert>
            </div>
        </div>
    );
}
