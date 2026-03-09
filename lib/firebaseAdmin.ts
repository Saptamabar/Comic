import { initializeApp, cert, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let adminApp;

try {
  adminApp = getApp();
} catch (e) {
  adminApp = initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_SDK!)),
  });
}

export const adminAuth = getAuth(adminApp);