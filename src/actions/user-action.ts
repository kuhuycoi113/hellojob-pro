'use server';
import { createDocument } from "@/lib/elasticsearch";
import { getFirebaseAdminApp } from "@/lib/firebase-admin";
import { randomUUID } from "crypto";
const APPLIED_JOBS_COLLECTION = 'hellojobv5-applied-jobs';

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

export async function applyJob(userId: string, job: any) {
    try {
        const newObj = {
            userID: userId,
            jobID: job.id,
            job,
            creatredDate: new Date().getTime()
        }
        await createDocument(APPLIED_JOBS_COLLECTION, randomUUID(), newObj);
    } catch (error) {
        throw error;
    }
}