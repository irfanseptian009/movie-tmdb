import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL || "";
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!(global as { _mongoClientPromise?: Promise<MongoClient> })._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as { _mongoClientPromise?: Promise<MongoClient> })._mongoClientPromise =
      client.connect();
  }
  clientPromise = (global as { _mongoClientPromise?: Promise<MongoClient> })
    ._mongoClientPromise!;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
