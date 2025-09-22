// Shared Todo model across all layers
export interface Todo {
  id: string; // Unique identifier
  title: string; // Todo title
  description: string; // Todo description
  isComplete: boolean; // Completion status
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last update timestamp
}

// DTOs for API operations
export interface CreateTodoDTO {
  title: string; // Required input
  description: string; // Required input
}

export interface UpdateTodoDTO {
  title?: string; // Optional update
  description?: string; // Optional update
  isComplete?: boolean; // Optional completion status
}

// API Response types
export interface TodoResponse {
  success: boolean; // Operation result
  data?: Todo | Todo[]; // Response data
  message?: string; // Error or success message
}
