const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todo.controller");
const { protect } = require("../middlewares/auth.middleware");
const { 
  createTodoRules, 
  updateTodoRules, 
  getTodoByIdRules, 
  getAllTodosRules 
} = require("../validators/todo.validator");
const validate = require("../middlewares/validate.middleware");

// Semua route di bawah ini wajib login terlebih dahulu
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: API untuk mengelola data Todo
 */

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Mendapatkan semua daftar todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data todos
 *   post:
 *     summary: Membuat todo baru
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Berhasil membuat todo
 */
router.post("/", createTodoRules, validate, todoController.createTodo);
router.get("/", getAllTodosRules, validate, todoController.getAllTodos);

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Mengambil detail todo berdasarkan ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detail data todo
 *   put:
 *     summary: Mengubah data todo berdasarkan ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Berhasil memperbarui todo
 *   delete:
 *     summary: Menghapus todo berdasarkan ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil menghapus todo
 */
router.get("/:id", getTodoByIdRules, validate, todoController.getTodoById);
router.put("/:id", updateTodoRules, validate, todoController.updateTodo);
router.delete("/:id", getTodoByIdRules, validate, todoController.deleteTodo);

module.exports = router;