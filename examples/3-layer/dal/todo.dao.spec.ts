import { TodoDAO } from './todo.dao';

describe('TodoDAO', () => {
  let dao: TodoDAO;

  beforeEach(() => {
    dao = new TodoDAO();
  });

  test('should create todo with ID and timestamps', async () => {
    const todo = await dao.create({
      title: 'Test Todo',
      description: 'Test Description',
    });

    expect(todo.id).toBeDefined(); // ID generated
    expect(todo.title).toBe('Test Todo'); // Title set
    expect(todo.description).toBe('Test Description'); // Description set
    expect(todo.isComplete).toBe(false); // Default incomplete
    expect(todo.createdAt).toBeInstanceOf(Date); // Timestamp set
    expect(todo.updatedAt).toBeInstanceOf(Date); // Timestamp set
  });

  test('should find todo by id', async () => {
    const created = await dao.create({
      title: 'Find Test',
      description: 'Find Description',
    });

    const found = await dao.findById(created.id);

    expect(found).toEqual(created); // Todo retrieved
  });

  test('should return null for non-existent id', async () => {
    const found = await dao.findById('non-existent-id');

    expect(found).toBeNull();
  });

  test('should find all todos', async () => {
    const todo1 = await dao.create({
      title: 'Todo 1',
      description: 'Description 1',
    });
    const todo2 = await dao.create({
      title: 'Todo 2',
      description: 'Description 2',
    });

    const todos = await dao.findAll();

    expect(todos).toHaveLength(2);
    expect(todos).toContainEqual(todo1);
    expect(todos).toContainEqual(todo2);
  });

  test('should update todo successfully', async () => {
    const created = await dao.create({
      title: 'Original Title',
      description: 'Original Description',
    });

    // Small delay to ensure different timestamps
    await new Promise((resolve) => setTimeout(resolve, 1));

    const updated = await dao.update(created.id, {
      title: 'Updated Title',
      isComplete: true,
    });

    expect(updated).not.toBeNull();
    expect(updated!.title).toBe('Updated Title');
    expect(updated!.description).toBe('Original Description'); // Unchanged
    expect(updated!.isComplete).toBe(true);
    expect(updated!.updatedAt.getTime()).toBeGreaterThan(created.updatedAt.getTime());
  });

  test('should return null when updating non-existent todo', async () => {
    const updated = await dao.update('non-existent-id', {
      title: 'Updated Title',
    });

    expect(updated).toBeNull();
  });

  test('should delete todo successfully', async () => {
    const created = await dao.create({
      title: 'To Delete',
      description: 'Delete Description',
    });

    const deleted = await dao.delete(created.id);

    expect(deleted).toBe(true);

    const found = await dao.findById(created.id);
    expect(found).toBeNull();
  });

  test('should return false when deleting non-existent todo', async () => {
    const deleted = await dao.delete('non-existent-id');

    expect(deleted).toBe(false);
  });
});
