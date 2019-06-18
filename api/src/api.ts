import express, { Express } from "express";
import { Firestore } from "@google-cloud/firestore";

const createHandler = (db: Firestore): Express => {
  const app = express();

  app.get(
    "/ane",
    async (req, res): Promise<void> => {
      const refs = await db
        .collection("oneetyans")
        .limit(10)
        .get();
      const records = refs.docs.map(d => d.data());
      res.send({ ok: true, ane: records });
    }
  );

  return app;
};

export default createHandler;
