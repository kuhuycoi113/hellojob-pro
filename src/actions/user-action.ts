'use server';
import { createDocument, searchDocuments, updateDocument } from "@/lib/elasticsearch";
import { getFirebaseAdminApp } from "@/lib/firebase-admin";
import { randomUUID } from "crypto";
const APPLIED_JOBS_COLLECTION = 'hellojobv5-applied-jobs';
import * as AWS from "aws-sdk";
import { FileMimeType } from "@/lib/file-mime-type";
import { validateProfileForApplication } from "@/lib/validators";
import { Role, User } from "@/contexts/AuthContext";

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

async function findByUID(uID: any): Promise<any | null> {
    try {
        if (!uID) {
            throw 'Chưa đăng nhập';
        }
        const adminApp = getFirebaseAdminApp();
        const db = adminApp.firestore();
        let user = (await db.collection('users').doc(uID).get())?.data() ?? null;
        let role: Role = 'guest';
        if (user) {
            if (validateProfileForApplication(user)?.length > 0) {
                role = 'candidate-empty-profile';
            } else if (user.type === 'ADMIN') {
                role = 'admin'
            } else {
                role = 'candidate';
            }
            user.role = role;

            if (!!user?.createdDate?.seconds) {
                user.createdDate = user.createdDate.seconds * 1000;
            }
            if (!!user?.dateOfBirth?.seconds) {
                user.dateOfBirth = user.dateOfBirth.seconds * 1000;
            }
            if (!!user?.dateOfFirstIssue?.seconds) {
                user.dateOfFirstIssue = user.dateOfFirstIssue.seconds * 1000;
            }
            user = { ...user, ...user };
            if (typeof user.createdDate !== 'number') {
                delete user.createdDate;
            }
        }
        return user;
    } catch (error) {
        return null;
    }
}
export const findCachedUser = findByUID;

export async function applyJob(userId: string, job: any) {
    try {
        const newObj = {
            userID: userId,
            jobID: job.id,
            job,
            createdDate: new Date().getTime()
        }
        await createDocument(APPLIED_JOBS_COLLECTION, randomUUID(), newObj);
    } catch (error) {
        throw error;
    }
}

export async function cancelAppliedJob(userID: string, jobID: string) {
    try {
        const query = {
            query: {
                bool: {
                    must: [
                        {
                            term: {
                                "userID.keyword": userID,
                            },
                        },
                        {
                            term: {
                                "jobID.keyword": jobID,
                            },
                        },
                    ]
                }
            },
            sort: [
                { "createdDate": { "order": "desc" } }
            ]
        }
        const historyApplieds = await searchDocuments(APPLIED_JOBS_COLLECTION, query, 1, 1);
        if (historyApplieds.total > 0) {
            const historyAppliedID = historyApplieds.docs[0].id;
            await updateDocument(APPLIED_JOBS_COLLECTION, historyAppliedID, {
                isCanceled: true
            });
        }
    } catch (error) {
        throw error;
    }
}

export async function updateAvatar(userId: string, oldAvatarUrl: string | null, file: File) {
    try {

        let relativePath: string | null = null;
        const adminApp = getFirebaseAdminApp();
        const db = adminApp.firestore();
        const s3 = new AWS.S3({ endpoint: process.env.AWS_MEDIA_END_POINT });
        try {
            AWS.config.update({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                signatureVersion: "v4",
            });
            const buffer = Buffer.from(await file.arrayBuffer());
            const folderUploadPrefix = `upload/hellojobv5/users/${userId}/avatar/`;
            let mimeType = file.type;
            if (!FileMimeType[mimeType]) {
                mimeType = "image/png";
            }
            const filename = Date.now() + "." + FileMimeType[mimeType];
            const params: any = {
                Bucket: process.env.AWS_MEDIA_BUCKET_NAME,
                Key: folderUploadPrefix + filename,
                Body: buffer,
                ContentType: file.type,
                ContentDisposition: "inline",
            };
            await s3.putObject(params).promise();
            relativePath = folderUploadPrefix + filename;
            const avatarUrl = `https://cdn.hellojob.jp/${folderUploadPrefix + filename}`;
            await db.collection('users').doc(userId).update({
                avatarUrl
            });
            if (!!oldAvatarUrl?.length) {
                // Xóa avatar cũ, nếu lỗi tứ là không xóa được, sẽ bắn ra exception, trong exception sẽ xóa avatar mới upload lên
                await s3
                    .deleteObject({
                        Key: oldAvatarUrl.replace('https://cdn.hellojob.jp/', ''),
                        Bucket: process.env.AWS_MEDIA_BUCKET_NAME ?? "",
                    })
                    .promise();
            }
            return avatarUrl;
        } catch (error) {
            if (!!relativePath) {
                await s3
                    .deleteObject({
                        Key: relativePath,
                        Bucket: process.env.AWS_MEDIA_BUCKET_NAME ?? "",
                    })
                    .promise();
            }
            if (!!oldAvatarUrl?.length) {
                await db.collection('users').doc(userId).update({
                    avatarUrl: oldAvatarUrl
                });
            }
            console.log(error);
        }
    } catch (error) {
        console.log(error)
    }
    return oldAvatarUrl;
}