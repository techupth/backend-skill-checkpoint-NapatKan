import express from "express";
import questions from "./apps/questions.js";
import { client } from "./utils/db.js";

async function init() {
  const app = express();
  const port = 4269;

  await client.connect();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/qwora", questions);

  app.get("/", (req, res) => {
    return res.json("Hello Skill Checkpoint #2");
  });

  app.get("*", (req, res) => {
    return res.status(404).json("Not found");
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

init();
