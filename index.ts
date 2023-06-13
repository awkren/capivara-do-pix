import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mysql from "mysql";

dotenv.config();

const app = express();
const port = process.env.PORT;

// mysql config
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "pixramide",
};

// create mysql connection pool
const pool = mysql.createPool(dbConfig);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("oi");
});

app.post("/users", (req: Request, res: Response) => {
  const { id, name, investment } = req.body;

  // create new user object
  const user = { id, name, investment };

  // insert user into database
  pool.query("INSERT INTO users SET ?", user, (error, results) => {
    if (error) {
      console.error("Error saving user: ", error);
      res.status(500).send("Error saving user");
    } else {
      console.log("User saved successfully");
      res.sendStatus(200);
    }
  });
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
