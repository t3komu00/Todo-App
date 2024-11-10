import fs from "fs";
import path from "path";

import { pool } from "./db.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { hash } from "bcrypt";
import pkg from "jsonwebtoken";
const { sign } = pkg;


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const initializeTestDb = () => {
  
  const sql = fs.readFileSync(
    path.resolve(__dirname, "../todo.sql"),
    "utf8"
  );

  
  pool.query(sql, (err) => {
    if (err) {
      console.error("Error initializing the database:", err);
      return;
    }
    console.log("Database initialized!");
  });
};
const insertTestUser = async (email, password) => {
  try {
  
    const hashedPassword = await new Promise((resolve, reject) => {
      hash(password, 10, (error, hash) => {
        if (error) reject(error);
        else resolve(hash);
      });
    });

    
    await pool.query("insert into account (email,password) values ($1,$2)", [
      email,
      hashedPassword,
    ]);

  } catch (error) {
   
    throw error; 
  }
};

const getToken = (email) => {
  return sign({ user: email }, process.env.JWT_SECRET_KEY);
};
export { initializeTestDb, insertTestUser, getToken };
