require("dotenv").config(); // Load file .env agar process.env terisi

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const connectDB = require("../config/db"); // Sesuaikan path ke file db.js kamu

describe("Stats Endpoint (API Key)", () => {
  // 1. KONEKSIKAN KE MONGOOSE SEBELUM TEST BERJALAN
  beforeAll(async () => {
    await connectDB();
  }, 30000);

  // 2. TUTUP KONEKSI MONGOOSE SETELAH TEST SELESAI (Hindari error TCPSERVERWRAP / Open Handle)
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should reject request without API key", async () => {
    const res = await request(app).get("/api/stats/summary");

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/api key is missing/i);
  });

  it("should reject request with invalid API key", async () => {
    const res = await request(app)
      .get("/api/stats/summary")
      .set("x-api-key", "kunci-ngasal");

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid api key/i);
  });

  it("should return summary with valid API key", async () => {
    // Gunakan fallback kunci jika di .env kamu variabelnya bernama API_KEY atau EXTERNAL_API_KEY
    const apiKey = process.env.EXTERNAL_API_KEY || process.env.API_KEY;

    const res = await request(app)
      .get("/api/stats/summary")
      .set("x-api-key", apiKey);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("totalTodos");
    expect(res.body.data).toHaveProperty("completedTodos");
    expect(res.body.data).toHaveProperty("pendingTodos");
  });
});