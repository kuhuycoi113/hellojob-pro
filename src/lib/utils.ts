import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseMessengerInput = (input: string): string => {
    if (!input) return '';
    const trimmedInput = input.trim();
    try {
        if (trimmedInput.startsWith('http') || trimmedInput.includes('facebook.com') || trimmedInput.includes('m.me')) {
            const url = new URL(trimmedInput.startsWith('http') ? trimmedInput : `https://${trimmedInput}`);
            
            if (url.hostname.includes('facebook.com') || url.hostname.includes('m.facebook.com')) {
                const id = url.searchParams.get('id');
                if (id && /^\d+$/.test(id)) {
                    return id; // Return numeric ID if found in profile.php
                }
                // For vanity URLs like facebook.com/username
                const pathParts = url.pathname.split('/').filter(part => part && part !== 'profile.php' && part !== 'people');
                if (pathParts.length > 0) {
                    return pathParts[pathParts.length - 1];
                }
            }
             if (url.hostname.includes('m.me')) {
                const pathParts = url.pathname.split('/').filter(Boolean);
                if (pathParts.length > 0) {
                     return pathParts[pathParts.length - 1];
                }
            }
        }
    } catch (error) {
        // Not a valid URL, treat as a potential username
        console.warn("Could not parse Messenger input as URL, treating as username:", error);
    }
    // Fallback: treat as username, remove any URL-like parts
    return trimmedInput.split('/').pop() || trimmedInput;
};

export const parseZaloInput = (input: string): string => {
    if (!input) return '';
    const trimmedInput = input.trim();
    if (trimmedInput.includes('zalo.me/')) {
        const parts = trimmedInput.split('/');
        return parts.pop()?.replace(/\D/g, '') || '';
    }
    return trimmedInput.replace(/\D/g, '');
};

export const parseLineInput = (input: string): string => {
  if (!input) return '';
  const trimmedInput = input.trim();
  try {
      if (trimmedInput.startsWith('http') && trimmedInput.includes('line.me/')) {
          const url = new URL(trimmedInput);
          const pathParts = url.pathname.split('/');
          let potentialId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
          if (potentialId) {
             // Remove query parameters
             potentialId = potentialId.split('?')[0];
             // Remove leading ~ or @ if present
             return potentialId.replace(/^[~@]/, '');
          }
      }
  } catch (error) {
       console.warn("Could not parse Line input as URL, treating as ID:", error);
  }
  // Fallback to treat the whole input as an ID, removing potential URL parts and special characters
  return trimmedInput.split('/').pop()?.replace(/^[~@]/, '') || trimmedInput.replace(/^[~@]/, '');
};
