import { region, config } from "firebase-functions";
import admin from "firebase-admin";
import createAPIHandler from "./api";

admin.initializeApp(config().firebase);
const db = admin.firestore();

export const api = region("asia-northeast1").https.onRequest(
  createAPIHandler(db)
);
