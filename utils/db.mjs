import * as pg from "pg";
import dns from "dns";

// บังคับ resolve IPv4 ก่อน (ช่วยกรณีเครือข่ายไม่รองรับ IPv6 ของ Supabase)
dns.setDefaultResultOrder("ipv4first");

const { Pool } = pg;

const connectionPool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false, // จำเป็นสำหรับเชื่อมต่อ Supabase PostgreSQL
  },
});

export default connectionPool;
