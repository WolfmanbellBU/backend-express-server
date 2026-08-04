import * as pg from "pg";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const { Pool } = pg;

const connectionPool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

export default connectionPool;
