
'use client';
import React from 'react';

// This layout is specifically for the video call page to provide a full-screen experience
// without the standard site header and footer.
export default function VideoCallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
