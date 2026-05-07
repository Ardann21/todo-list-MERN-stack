import { Router } from "express";
import { createTodo, getTodos, updateTodo, deleteTodo } from "../controllers/todo.controller.js";

const router = Router();

// Create a new todo
router.post("/todos", createTodo);
// Get all todos
router.get("/todos", getTodos);
// Get a single todo by ID

// Update a todo
router.patch("/todos/:id", updateTodo);
// Delete a todo
router.delete("/todos/:id", deleteTodo);

export default router;