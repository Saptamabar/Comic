import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const envVar = process.env.FIREBASE_ADMIN_SDK || "{}";
const serviceAccount = JSON.parse(envVar.replace(/^'|'$/g, ''));
if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
}

const adminApp = getApps().length > 0 
  ? getApp() 
  : initializeApp({
      credential: cert(serviceAccount),
    });

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);