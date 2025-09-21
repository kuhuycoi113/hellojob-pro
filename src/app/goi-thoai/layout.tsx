
'use client';
import React from 'react';

// This layout is specifically for the voice call page to provide a full-screen experience
// without the standard site header and footer.
export default function VoiceCallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
