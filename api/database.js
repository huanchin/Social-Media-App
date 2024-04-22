import dotenv from "dotenv";
import mysql from "mysql2";

const result = dotenv.config();

if (result.error) {
  console.error(result.error);
} else {
  console.log("Environment variables loaded successfully");
  // console.log(process.env.MYSQL_HOST);
}

// MySQL Connection Pool
const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: "social",
  })
  .promise();

export default pool;
