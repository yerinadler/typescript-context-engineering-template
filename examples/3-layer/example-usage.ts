const express = require('express');
import { TodoController } from './controllers/todo.controller';
import { TodoDAO } from './dal/todo.dao';
import { TodoService } from './services/todo.service';

/**
 * Example usage of the 3-layer architecture
 * This demonstrates how to wire up the dependencies and use the architecture
 */

// Initialize the layers in the correct order (bottom-up)
const todoDAO = new TodoDAO();
const todoService = new TodoService(todoDAO);
const todoController = new TodoController(todoService);

// Example: Creating an Express server with the Todo controller
const app = express();
app.use(express.json());

// RESTful routes for Todo management
app.post('/todos', todoController.createTodo.bind(todoController));
app.get('/todos', todoController.getAllTodos.bind(todoController));
app.get('/todos/:id', todoController.getTodoById.bind(todoController));
app.put('/todos/:id', todoController.updateTodo.bind(todoController));
app.delete('/todos/:id', todoController.deleteTodo.bind(todoController));

// Example usage without Express (direct service calls)
export const directUsageExample = async () => {
  try {
    // Create a todo through the service layer
    const newTodo = await todoService.createTodo({
      title: 'Learn 3-Layer Architecture',
      description: 'Understand the separation of concerns in layered architecture',
    });
    console.log('Created todo:', newTodo);

    // Retrieve all todos
    const todos = await todoService.getAllTodos();
    console.log('All todos:', todos);

    // Update the todo
    const updatedTodo = await todoService.updateTodo(newTodo.id, {
      isComplete: true,
    });
    console.log('Updated todo:', updatedTodo);

    // Delete the todo
    const deleted = await todoService.deleteTodo(newTodo.id);
    console.log('Todo deleted:', deleted);
  } catch (error) {
    console.error('Error:', (error as Error).message);
  }
};

// Export the configured app for use
export { app, todoController, todoService, todoDAO };

// Example: Start the server (uncomment to run)
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`3-Layer Architecture Todo API running on port ${PORT}`);
//   console.log('Available endpoints:');
//   console.log('  POST   /todos       - Create a new todo');
//   console.log('  GET    /todos       - Get all todos');
//   console.log('  GET    /todos/:id   - Get todo by ID');
//   console.log('  PUT    /todos/:id   - Update todo by ID');
//   console.log('  DELETE /todos/:id   - Delete todo by ID');
// });
