import express, { Express } from "express";
import { Firestore } from "@google-cloud/firestore";

type CreateAnePayload = string[];

interface Oneetyan {
  name: string;
}

const isCreateAnePayload = (payload: any): payload is CreateAnePayload =>
  Array.isArray(payload);

const createHandler = (db: Firestore): Express => {
  const oneetyansCollection = db.collection("oneetyans");
  const app = express();

  app.use(express.json());

  app.get(
    "/ane",
    async (req, res, next): Promise<void> => {
      try {
        const refs = await oneetyansCollection.limit(10).get();
        const records = refs.docs.map(doc => doc.data() as Oneetyan);
        res.send({ ok: true, ane: records });
      } catch (e) {
        next(e);
      }
    }
  );

  app.post(
    "/ane",
    async (req, res, next): Promise<void> => {
      const contentType = req.headers["content-type"];
      if (
        contentType === undefined ||
        !/^application\/json(\b|$)/.test(contentType)
      ) {
        res.status(400);
        res.send({ errors: ["JSON-encoded body required", { contentType }] });
        return;
      }

      const payload = req.body;
      if (!isCreateAnePayload(payload)) {
        res.status(400);
        res.send({ errors: ["expected array of names but got anything else"] });
        return;
      }

      const batch = db.batch();
      for (const name of payload) {
        const ref = oneetyansCollection.doc(name);
        const data: Oneetyan = {
          name
        };
        batch.set(ref, data);
      }
      try {
        await batch.commit();
        res.send({ ok: true });
      } catch (e) {
        next(e);
      }
    }
  );

  return app;
};

export default createHandler;
