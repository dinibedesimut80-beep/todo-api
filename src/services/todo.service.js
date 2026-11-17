const Todo = require("../models/todo.model");

async function createTodo(data) {
  const todo = new Todo({
    title: data.title,
    description: data.description,
    owner: data.owner,
  });
  return await todo.save();
}

async function getAllTodos(ownerId) {
  return await Todo.find({ owner: ownerId }).sort({ createdAt: -1 });
}

async function getAllTodosForAdmin() {
  return await Todo.find().sort({ createdAt: -1 }).populate("owner", "name email");
}

async function getTodoById(id) {
  return await Todo.findById(id);
}

async function updateTodo(id, data) {
  return await Todo.findByIdAndUpdate(
    id,
    {
      title: data.title,
      description: data.description,
      completed: data.completed,
    },
    { new: true, runValidators: true }
  );
}

async function deleteTodo(id) {
  return await Todo.findByIdAndDelete(id);
}

async function getSummaryStats() {
  const totalTodos = await Todo.countDocuments();
  const completedTodos = await Todo.countDocuments({ completed: true });
  const pendingTodos = await Todo.countDocuments({ completed: false });

  return {
    totalTodos,
    completedTodos,
    pendingTodos,
  };
}

module.exports = {
  createTodo,
  getAllTodos,
  getAllTodosForAdmin,
  getTodoById,
  updateTodo,
  deleteTodo,
  getSummaryStats,
};