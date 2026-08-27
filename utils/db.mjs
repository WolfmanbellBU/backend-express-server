import * as pg from "pg";
import dns from "dns";

// Direct db.*.supabase.co เป็น IPv6-only — เครื่องที่ไม่มี IPv6 ต้องใช้ pooler (IPv4)
dns.setDefaultResultOrder("ipv4first");

const { Pool } = pg;

const connectionPool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false, // จำเป็นสำหรับเชื่อมต่อ Supabase PostgreSQL
  },
});

export default connectionPool;
