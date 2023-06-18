import { Request, Response } from "express";
import { pool } from "../db";
import _ from "lodash";

let totalUsers = 0;

const updateTotalUsers = () => {
  pool.query("SELECT COUNT(*) AS total FROM users", (error, results) => {
    if(error){
      console.error("Error retrieving total users: ", error)
    }else{
      totalUsers = results[0].total || 0;
      console.log("Total users: ", totalUsers)
    }
  })
}

updateTotalUsers();

const getUsers = (req: Request, res: Response) => {
  // retrieve users from db
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) {
      console.error("Error retrieving users: ", error);
      res.status(500).send("Error retrieving users");
    } else {
      res.json(results);
    }
  });
};

console.log(totalUsers)

const createUser = (req: Request, res: Response) => {
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
      totalUsers++;
      res.sendStatus(200);
    }
  });
};

const withdrawUserProfit = (req: Request, res: Response) => {
  const { id } = req.body;

  const randomChance = totalUsers > 5 ? (totalUsers - 5) * 0.05 : 0;

  // check total users to apply random change to not be able to withdraw
  if (totalUsers > 5 && _.random(0, 1) < randomChance) {
    res.status(403).send("Withdraw not allowed");
    return;
  }

  // retrieve users from db
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
};

const deleteUser = (req: Request, res: Response) => {
  const { id } = req.params;

  // delete user from db
  pool.query("DELETE FROM users WHERE id = ?", [id], (error) => {
    if (error) {
      console.error("Error deleting user", error);
      res.status(500).send("Error deleting user");
    } else {
      console.log("User deleted successfully");
      res.sendStatus(200);
    }
  });
};

export { getUsers, createUser, withdrawUserProfit, deleteUser };

