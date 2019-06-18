import { region } from "firebase-functions";
import admin from "firebase-admin";

admin.initializeApp();

export const api = region("asia-northeast1").https.onRequest(
  async (_, res): Promise<void> => {
    res.send({ ok: true, ane: [] });
  }
);
