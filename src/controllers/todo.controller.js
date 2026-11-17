const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Todo = require("../models/todo.model");
const todoService = require("../services/todo.service");

const createTodo = catchAsync(async (req, res, next) => {
  const { title, description } = req.body;

  if (!title) {
    return next(new AppError("Title is required", 400));
  }

  const todo = await todoService.createTodo({
    title,
    description,
    owner: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Todo created successfully",
    data: todo,
  });
});

const getAllTodos = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const filter = req.user.role === "admin" ? {} : { owner: req.user._id };
  if (req.query.completed !== undefined) {
    filter.completed = req.query.completed === 'true';
  }

  const totalItems = await Todo.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / limit);

  const sortBy = req.query.sortBy || 'createdAt';
  const order = req.query.order === 'asc' ? 1 : -1;

  const todos = await Todo.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: order });

  res.status(200).json({
    success: true,
    message: "Todos retrieved successfully",
    data: todos,
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalItems,
      itemsPerPage: limit
    },
  });
});

const getTodoById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const todo = await todoService.getTodoById(id);

  if (!todo) {
    return next(new AppError("Todo not found", 404));
  }

  const isOwner = todo.owner.toString() === req.user._id.toString();

  if (!isOwner && req.user.role !== "admin") {
    return next(new AppError("You do not have permission to access this todo", 403));
  }

  res.status(200).json({
    success: true,
    message: "Todo retrieved successfully",
    data: todo,
  });
});

const updateTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  const existingTodo = await todoService.getTodoById(id);

  if (!existingTodo) {
    return next(new AppError("Todo not found", 404));
  }

  const isOwner = existingTodo.owner.toString() === req.user._id.toString();

  if (!isOwner && req.user.role !== "admin") {
    return next(new AppError("You do not have permission to update this todo", 403));
  }

  const updatedTodo = await todoService.updateTodo(id, { title, description, completed });

  res.status(200).json({
    success: true,
    message: "Todo updated successfully",
    data: updatedTodo,
  });
});

const deleteTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const existingTodo = await todoService.getTodoById(id);

  if (!existingTodo) {
    return next(new AppError("Todo not found", 404));
  }

  const isOwner = existingTodo.owner.toString() === req.user._id.toString();

  if (!isOwner && req.user.role !== "admin") {
    return next(new AppError("You do not have permission to delete this todo", 403));
  }

  await todoService.deleteTodo(id);

  res.status(200).json({
    success: true,
    message: "Todo deleted successfully",
    data: existingTodo,
  });
});

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};