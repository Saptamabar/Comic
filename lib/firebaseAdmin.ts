import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK!);

const adminApp = getApps().length > 0 
  ? getApp() 
  : initializeApp({
      credential: cert(serviceAccount),
    });

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);