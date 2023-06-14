import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mysql from "mysql";
import schedule from "node-schedule";

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

app.get("/users", (req: Request, res: Response) => {
  // retrieve users from db
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) {
      console.error("Error retrieving users: ", error);
      res.status(500).send("Error retrieving users");
    } else {
      res.json(results);
    }
  });
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

// calculate profit
const calculateProfits = () => {
  // retrieve users from db
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) {
      console.error("Error retrieving users", error);
    } else {
      // iterate through users and calculate profit
      results.forEach((user: any) => {
        const investment = user.investment;
        const valueProfit = user.profit;
        const profit = valueProfit + investment * 0.3333;

        // update user's profit in the database
        pool.query(
          "UPDATE users SET profit = ? WHERE id = ?",
          [profit, user.id],
          (error) => {
            if (error) {
              console.error("Error updating user profite: ", error);
            } else {
              console.log("Profit calculated and updated for user: ", user.id);
            }
          }
        );
      });
    }
  });
};

// schedule task to run every minute
schedule.scheduleJob("* * * * *", calculateProfits);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
