require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const connectDB = require("../config/db");
const User = require("../models/user.model"); // Import User model langsung

describe("Auth Endpoints", () => {
  // 1. KONEKSIKAN DATABASE SEBELUM SEMUA TEST BERJALAN
  beforeAll(async () => {
    await connectDB();
  }, 30000);

  // 2. BERSIHKAN KOLEKSI USER SEBELUM SETIAP TEST BERJALAN
  beforeEach(async () => {
    if (mongoose.connection.readyState === 1) {
      await User.deleteMany({});
    }
  });

  // 3. TUTUP KONEKSI MONGOOSE SETELAH SELURUH TEST SELESAI
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Budi",
        email: "budi@example.com",
        password: "rahasia123",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe("budi@example.com");
      expect(res.body.data.token).toBeDefined();
    });

    it("should reject registration with missing fields", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "budi@example.com",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should reject duplicate email", async () => {
      await request(app).post("/api/auth/register").send({
        name: "Budi",
        email: "budi@example.com",
        password: "rahasia123",
      });

      const res = await request(app).post("/api/auth/register").send({
        name: "Budi Kedua",
        email: "budi@example.com",
        password: "rahasia456",
      });

      expect(res.statusCode).toBe(409);
      expect(res.body.message).toMatch(/already registered/i);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Karena beforeEach utama di atas sudah jalankan User.deleteMany({}),
      // database pasti bersih saat user baru didaftarkan di sini.
      await request(app).post("/api/auth/register").send({
        name: "Budi",
        email: "budi@example.com",
        password: "rahasia123",
      });
    });

    it("should login successfully with correct credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "budi@example.com",
        password: "rahasia123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });

    it("should reject login with wrong password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "budi@example.com",
        password: "password-salah",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/invalid email or password/i);
    });
  });
});