'use server';
import { getFirebaseAdminApp } from "@/lib/firebase-admin";

export async function updateProfile(userId: any, data: any) {
    try {
        const adminApp = getFirebaseAdminApp();
        const db = adminApp.firestore();
        await db.collection('users').doc(userId).update(data);
        return true;
    } catch (error) {
        return false;
    }
}