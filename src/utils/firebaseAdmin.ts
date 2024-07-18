// https://www.jamesshopland.com/blog/nextjs-firebase-admin-sdk

import "server-only";

import admin from "firebase-admin";

interface FirebaseAdminAppParams {
  projectId: string;
  clientEmail: string;
  storageBucket: string;
  privateKey: string;
}

function formatPrivateKey(key: string) {
  return key.replace(/\\n/g, "\n");
}

export function createFirebaseAdminApp(params: FirebaseAdminAppParams) {
  const privateKey = formatPrivateKey(params.privateKey);

  try {
    if (admin.apps.length > 0) {
      return admin.app("admin");
    }
  } catch (_error) {}

  const cert = admin.credential.cert({
    projectId: params.projectId,
    clientEmail: params.clientEmail,
    privateKey,
  });

  return admin.initializeApp(
    {
      credential: cert,
      projectId: params.projectId,
      storageBucket: params.storageBucket,
    },
    "admin"
  );
}

export async function initAdmin() {
  const params = {
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
    clientEmail: process.env.CLIENT_EMAIL as string,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET as string,
    privateKey: process.env.PRIVATE_KEY as string,
  };

  return createFirebaseAdminApp(params);
}
