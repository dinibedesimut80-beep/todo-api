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

router.post("/", createTodoRules, validate, todoController.createTodo);
router.get("/", getAllTodosRules, validate, todoController.getAllTodos);
router.get("/:id", getTodoByIdRules, validate, todoController.getTodoById);
router.put("/:id", updateTodoRules, validate, todoController.updateTodo);
router.delete("/:id", getTodoByIdRules, validate, todoController.deleteTodo);

module.exports = router;