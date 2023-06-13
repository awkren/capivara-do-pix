import sqlite3 from "sqlite3";

// create and open database
const openDatabase = async () => {
  return new sqlite3.Database("db.sqlite3");
};

// create table if it doesnt exist
const createTable = async () => {
  const db = await openDatabase();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user TEXT NOT NULL,
      deposit REAL,
      profit REAL
    );
  `);
};

// init database
const initializeDatabase = async () => {
  await createTable();
};

export default initializeDatabase;
