import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI as string;
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const { dbUser, dbPassword, dbName, collectionName, document } = req.body;

        const uri = MONGO_URI;
        const client = new MongoClient(uri);

        try {
            await client.connect();
            const collection = client.db(dbName).collection(collectionName);
            const result = await collection.insertOne(document);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            // @ts-ignore
            res.status(500).json({ success: false, message: error.message });
        } finally {
            await client.close();
        }
    } else {
        res.status(400).json({ success: false, message: "Only POST requests are accepted" });
    }
};

export default handler;
