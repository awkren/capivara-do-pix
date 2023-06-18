import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mysql from "mysql";
import schedule from "node-schedule";
import _ from "lodash";
import { getUsers, createUser, withdrawUserProfit, deleteUser } from "./controllers/usersController";

dotenv.config();

const app = express();
const port = process.env.PORT;

// mysql config
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "123",
  database: process.env.DB_NAME || "pixramide",
};

// create mysql connection pool
const pool = mysql.createPool(dbConfig);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("oi");
});

app.get("/users", getUsers);
app.post("/users", createUser);
app.post("/users/withdraw", withdrawUserProfit);
app.delete("/users/:id", deleteUser);

let totalUsers = 0;

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
        const maxProfit = investment * 0.3333 * 30;

        if (valueProfit >= maxProfit) {
          console.log(
            "User has reached maximum allowed value for user profit"
          );
          return;
        }

        const newProfit = valueProfit + investment * 0.3333;

        // limit profit to not exceed
        const profit = Math.min(newProfit, maxProfit);

        // update user's profit in the database
        pool.query(
          "UPDATE users SET profit = ? WHERE id = ?",
          [profit, user.id],
          (error) => {
            if (error) {
              console.error("Error updating user profit: ", error);
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

