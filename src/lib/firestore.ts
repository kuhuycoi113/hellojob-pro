import admin from 'firebase-admin';
import { serverConfig } from './firebase-server';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serverConfig.serviceAccount),
    });
    console.log('Firebase Admin initialized.');
  } catch (error: any) {
    console.error('Firebase Admin initialization error:', error.stack);
  }
}

export const db = admin.firestore();
