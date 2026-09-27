import * as pg from "pg";
import dns from "dns";

// Direct db.*.supabase.co เป็น IPv6-only — เครื่องที่ไม่มี IPv6 ต้องใช้ pooler (IPv4)
dns.setDefaultResultOrder("ipv4first");

const { Pool } = pg;

// Vercel เป็น IPv4 — ใช้ pooler (aws-*.pooler.supabase.com:6543) ไม่ใช้ db.*.supabase.co:5432
const connectionPool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false, // จำเป็นสำหรับเชื่อมต่อ Supabase PostgreSQL
  },
  max: process.env.VERCEL ? 1 : 10,
});

export default connectionPool;
