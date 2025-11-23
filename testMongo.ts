import clientPromise from "./mongo.ts";

async function testMongo() {
  try {
    const client = await clientPromise;
    console.log("Connected to MongoDB!");

    const db = client.db("revenue_db");

    const result = await db.collection("test_connection").insertOne({
      message: "Test OK",
      at: new Date(),
    });

    console.log("Inserted ID:", result.insertedId);
  } catch (err) {
    console.error("❌ MongoDB Test Failed:", err);
  }
}

testMongo();
