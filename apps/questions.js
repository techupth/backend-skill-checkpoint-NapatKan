import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const questions = Router();

questions.post("/post", async (req, res) => {
  try {
    const collection = db.collection("qwora");

    const dbCount = await collection.countDocuments();

    let questionID;

    if (dbCount === 0) {
      questionID = 1;
    } else {
      const newDbCount = await collection.findOne({}, { sort: { _id: -1 } });
      questionID = newDbCount._id + 1;
    }

    const dat = {
      _id: questionID,
      ...req.body,
    };
    const newDat = await collection.insertOne(dat);

    return res.json({ message: `done creating ${newDat.insertedId}` });
  } catch (error) {
    return res.json({
      message: "bricked",
    });
  }
});

questions.get("/questions", async (req, res) => {
  const collection = db.collection("qwora");

  if (req.query.limit > 20) {
    return res.json({
      message: "potato server, please call less than 20 posts at a time",
    });
  }

  const limit = parseInt(req.query.limit) || 20;
  const searchResult = await collection.find().limit(limit).toArray();

  return res.json({
    data: searchResult,
  });
});

questions.get("/question/:id", async (req, res) => {
  const collection = db.collection("qwora");
  const postId = req.params.id;

  const calledPost = await collection.findOne({ _id: parseInt(postId) });

  return res.json({ data: calledPost });
});

questions.put("/edit/:id", async (req, res) => {
  const collection = db.collection("qwora");
  const postId = req.params.id;
  const newPost = { ...req.body };

  await collection.updateOne({ _id: parseInt(postId) }, { $set: newPost });

  return res.json({
    message: `post number ${postId} has been updated`,
  });
});

questions.delete("/delete/:id", async (req, res) => {
  const collection = db.collection("qwora");
  const postId = req.params.id;

  await collection.deleteOne({ _id: parseInt(postId) });

  return res.json({
    message: `post number ${postId} has been deleted`,
  });
});
export default questions;
