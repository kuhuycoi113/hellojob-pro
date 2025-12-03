'use client';

import { waitForDebugger } from 'node:inspector/promises';
import React, { useState, useRef, useCallback } from 'react';
import { Skeleton } from './skeleton';

interface AutoHeightIframeProps {
    htmlContent: string;
    title?: string;
    className?: string;
}

/**
 * A React component that renders an iframe that automatically adjusts its height
 * to fit its content, preventing internal scrollbars.
 */
export function AutoHeightIframe({
    htmlContent,
    title = "Embedded Content",
    className = ""
}: AutoHeightIframeProps) {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const fakeRef = useRef<HTMLIFrameElement | null>(null);
    const [height, setHeight] = useState<string>('0px');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // const handleLoad = useCallback(() => {
    //     waitForDebugger
    // }, []);

    // Reset height when content changes to avoid showing stale height
    React.useEffect(() => {
        if (!!fakeRef?.current) {
            setTimeout(() => {
                const iframe = iframeRef.current;
                if (iframe && iframe.contentWindow) {
                    const contentHeight = iframe.contentWindow.document.body.scrollHeight;
                    setHeight(`${contentHeight + 20}px`); // Add a small buffer
                    setIsLoading(false);
                }
            }, 1000)
        }
    }, [fakeRef]);

    return (
        <>
            <div className="relative min-h-[200px]">
                {isLoading && (
                    <div className="absolute inset-0">
                        <Skeleton className="w-full h-full" />
                    </div>
                )}
                <iframe
                    ref={iframeRef}
                    srcDoc={htmlContent}
                    title={title}
                    className={className} // Use the onLoad prop directly
                    style={{
                        width: '100%',
                        height: height,
                        border: 'none' // Smooth height transition
                    }}
                    scrolling="no" // Disable the iframe's own scrollbar
                />
                <div ref={fakeRef}></div>
            </div>
        </>
    );
}
