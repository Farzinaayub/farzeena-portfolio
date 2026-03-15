import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "farzeena-portfolio";

if (!MONGODB_URI) throw new Error("MONGODB_URI environment variable is required");

const NEW_EMAIL = process.env.ADMIN_EMAIL_VALUE || process.env.ADMIN_EMAIL;
if (!NEW_EMAIL) throw new Error("ADMIN_EMAIL_VALUE or ADMIN_EMAIL must be set");

const client = new MongoClient(MONGODB_URI);
await client.connect();
const db = client.db(DB_NAME);
const users = db.collection("user");

await users.deleteMany({});
await users.insertOne({
  email: NEW_EMAIL,
  name: "Farzeena Admin",
  emailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const allUsers = await users.find({}).toArray();
console.log("✅ Admin user set to:", allUsers.map((u: { email?: string }) => u.email));

await client.close();
