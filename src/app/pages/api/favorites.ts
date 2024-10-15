import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db();

  if (req.method === "GET") {
    const { userId } = req.query;
    const favorites = await db.collection("FavoriteMovie").find({ userId }).toArray();
    return res.status(200).json(favorites);
  }

  if (req.method === "POST") {
    const { userId, movieId, rating } = req.body; // Menerima rating
    const result = await db
      .collection("FavoriteMovie")
      .insertOne({ userId, movieId, rating });
    return res.status(201).json(result);
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    const result = await db
      .collection("FavoriteMovie")
      .deleteOne({ _id: new ObjectId(id as string) });
    return res.status(200).json(result);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
