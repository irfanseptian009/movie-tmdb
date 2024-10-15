import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db();

  if (req.method === "POST") {
    const { userId, movieId, content, rating } = req.body;
    const result = await db
      .collection("Review")
      .insertOne({ userId, movieId, content, rating });
    return res.status(201).json(result);
  }

  if (req.method === "GET") {
    const { movieId } = req.query;
    const reviews = await db
      .collection("Review")
      .find({ movieId: Number(movieId) })
      .toArray();
    return res.status(200).json(reviews);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
