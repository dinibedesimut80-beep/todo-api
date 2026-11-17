require("dotenv").config(); // 1. Load environment variables

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const connectDB = require("../config/db"); // Sesuaikan path jika db.js ada di lokasi lain
const User = require("../models/user.model"); // Import User model untuk pembersihan data
const Todo = require("../models/todo.model"); // Import Todo model untuk pembersihan data

async function registerAndLogin(email = "budi@example.com") {
  // Gunakan timestamp agar email selalu unik jika registrasi dipanggil berulang
  await request(app).post("/api/auth/register").send({
    name: "Budi",
    email,
    password: "rahasia123",
  });

  const loginRes = await request(app).post("/api/auth/login").send({
    email,
    password: "rahasia123",
  });

  return loginRes.body?.data?.token;
}

describe("Todo Endpoints", () => {
  let token;

  // 2. KONEKSI KE DATABASE SEBELUM SEMUA TEST JALAN
  beforeAll(async () => {
    await connectDB();
  }, 30000);

  // 3. TUTUP KONEKSI SETELAH SEMUA TEST SELESAI
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // 4. BERSIHKAN DATABASE SETIAP KALI SEBELUM TEST RUNNING
  beforeEach(async () => {
    await User.deleteMany({});
    await Todo.deleteMany({});
    token = await registerAndLogin();
  });

  describe("POST /api/todos", () => {
    it("should create a new todo when authenticated", async () => {
      const res = await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Belajar Jest dan Supertest" });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.title).toBe("Belajar Jest dan Supertest");
      expect(res.body.data.completed).toBe(false);
    });

    it("should reject creating todo without authentication", async () => {
      const res = await request(app)
        .post("/api/todos")
        .send({ title: "Tanpa token" });

      expect(res.statusCode).toBe(401);
    });

    it("should reject title shorter than 3 characters", async () => {
      const res = await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "ab" });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/between 3 and 100/i);
    });
  });

  describe("GET /api/todos", () => {
    it("should return paginated todos for the logged-in user", async () => {
      // Buat 3 todo terlebih dahulu
      for (let i = 1; i <= 3; i++) {
        await request(app)
          .post("/api/todos")
          .set("Authorization", `Bearer ${token}`)
          .send({ title: `Todo ke-${i}` });
      }

      const res = await request(app)
        .get("/api/todos?page=1&limit=2")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination.totalItems).toBe(3);
      expect(res.body.pagination.totalPages).toBe(2);
    });

    it("should not return todos belonging to another user", async () => {
      await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Todo milik Budi" });

      const otherToken = await registerAndLogin("siti@example.com");

      const res = await request(app)
        .get("/api/todos")
        .set("Authorization", `Bearer ${otherToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(0);
    });
  });

  describe("DELETE /api/todos/:id", () => {
    it("should not allow deleting another user's todo", async () => {
      const createRes = await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Todo milik Budi" });

      const todoId = createRes.body.data._id;
      const otherToken = await registerAndLogin("siti@example.com");

      const res = await request(app)
        .delete(`/api/todos/${todoId}`)
        .set("Authorization", `Bearer ${otherToken}`);

      expect(res.statusCode).toBe(403);
    });

    it("should return 404 when deleting a non-existent todo", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const res = await request(app)
        .delete(`/api/todos/${fakeId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });
});