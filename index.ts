import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mysql from "mysql";
import schedule from "node-schedule";
import _ from "lodash";

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

let totalUsers = 0;

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
      totalUsers++
      res.sendStatus(200);
    }
  });
});

app.post("/users/withdraw", (req: Request, res: Response) => {
  const { id } = req.body;

  const randomChance = totalUsers > 5 ? (totalUsers-5) * 0.05 : 0;

  // check total users to apply random change to no be able to withdraw
  if(totalUsers > 5 && _.random(0, 1) < randomChance){
    res.status(403).send("Withdraw not allowed");
    return;
  }

  //retrieve users from db
  pool.query("SELECT * FROM users WHERE id = ?", [id], (error, results) => {
    if (error) {
      console.error("Error retrieving user: ", error);
      res.status(500).send("Error retrieving user");
    } else if (results.length === 0) {
      res.status(404).send("User not found");
    } else {
      const user = results[0];
      const profit = user.profit || 0;

      // update user's profit in db to 0
      pool.query("UPDATE users SET profit = 0 WHERE id = ?", [id], (error) => {
        if (error) {
          console.error("Error updating user profit: ", error);
          res.status(500).send("Error updating user profit");
        } else {
          console.log("Profit withdrawn for user: ", id);
          res.sendStatus(200);
        }
      });
    }
  });
});

app.delete("/users/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  // delete user from db
  pool.query("DELETE FROM users WHERE id = ?", [id], (error) => {
    if(error){
      console.error("Error deleting user", error);
      res.status(500).send("Error deleting user");
    }else{
      console.log("User deleted successfully");
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
        const maxProfit = investment * 0.3333 * 30;

        if (valueProfit >= maxProfit) {
          console.log(
            "User has reached maximmum allowed value for user profit"
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
