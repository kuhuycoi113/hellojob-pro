import { User } from "@/contexts/AuthContext";
import { app, auth, db } from "@/lib/firebase";
import { ConfirmationResult, FacebookAuthProvider, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup, UserCredential } from "firebase/auth";
import { doc, getDoc, Timestamp, setDoc } from "firebase/firestore";
import { Tokens } from "next-firebase-auth-edge";
import { filterStandardClaims } from 'next-firebase-auth-edge/lib/auth/claims';

export enum ACCOUNT_TYPES {
    GOOGLE = 'google.com',
    FACEBOOK = 'facebook.com',
    PHONE = 'phone'
}

export const phoneAuth = (submitButtonId: string, phoneNumber: string) => {
    const recaptchaVerifier = new RecaptchaVerifier(
        auth,
        submitButtonId,
        {
            size: 'invisible',
        },
    );
    return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
}

export const verifyOtp = (confirmationResult: ConfirmationResult, otp: string) => {
    return confirmationResult.confirm(otp);
}
export const setUserData = async (user: any, refCode: any, createdDate: number) => {
    const userRef = doc(db, `users`, user.uid);
    const userData = (await getDoc(userRef))?.data();
    let isNewUser = false;
    if (!userData?.id) {
        isNewUser = true;
        let providerId;
        try {
            providerId = user.providerData[0].providerId ?? user.providerId;
        } catch (error) {
            providerId = user.providerId;
        }
        const data: any = {
            id: user.uid,
            auth: {
                providerId
            },
            createdDate,
            status: 0,
            isPublish: true,
            type: 'AGENT'
        };
        // tìm người giới thiệu trong trường hợp có refCode truyền vào
        try {
            data.contacts = {};
            if (!!user.phoneNumber) {
                data.contacts.phone = [user.phoneNumber];
                data.phoneNumber = user.phoneNumber;
            }
            if (!!user.email) {
                data.contacts.email = [user.email];
                data.email = user.email;
            }
        } catch (error) {

        }
        switch (providerId) {
            case ACCOUNT_TYPES.GOOGLE: {
                data.auth.username = user.email;
                data.email = user.email;
                break;
            }
            case ACCOUNT_TYPES.PHONE: {
                data.phoneNumber = user.phoneNumber;
                data.auth.username = user.phoneNumber;
                break;
            }
            default:
                break;
        }
        await setDoc(userRef, data, {
            merge: true,
        });
    }
    return {
        isNewUser,
        userInfo: userData
    };
}


const authLogin = (provider: any, refID: any) => {
    try {
        return signInWithPopup(auth, provider);
    } catch (error) {
        throw error;
    }
    // return signInWithPopup(auth, provider)
    //     .then(async (result) => {
    //         // return await setUserData({ ...result, refID });
    //     })
    //     .catch((error) => {
    //         if (error.message === 'Email này đã được đăng ký') {
    //             alert(error.message);
    //         } else {
    //             console.error(error);
    //         }
    //         throw error;
    //     });
}

export const googleAuth = async (refID: any) => {
    return await authLogin(new GoogleAuthProvider(), refID);
}

export const facebookAuth = async (refID: any) => {
    return await authLogin(new FacebookAuthProvider(), refID);
}

export const signOut = async () => {
    return await auth.signOut();
}


export const toUser = ({ decodedToken }: Tokens): User => {
    const {
        uid,
        email,
        picture: photoURL,
        email_verified: emailVerified,
        phone_number: phoneNumber,
        name: displayName,
        auth_time: authTime,
        source_sign_in_provider: signInProvider
    } = decodedToken;

    const customClaims = filterStandardClaims(decodedToken);

    return {
        uid,
        email: email ?? null,
        displayName: displayName ?? null,
        photoURL: photoURL ?? null,
        phoneNumber: phoneNumber ?? null,
        emailVerified: emailVerified ?? false,
        providerId: signInProvider,
        customClaims,
        authTime
    };
};