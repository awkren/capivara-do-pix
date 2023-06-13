import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import initializeDatabase from "./db";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// init database
initializeDatabase();

app.get("/", (req: Request, res: Response) => {
  res.send("oi");
});

app.listen(port, () => {
  console.log(`running on port ${port}`);
});
