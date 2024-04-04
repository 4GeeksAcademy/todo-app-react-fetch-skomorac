export const createUser = async (userName) => {
  try {
    const response = await fetch(
      `https://playground.4geeks.com/todo/users/${userName}`,
      {
        method: "POST",
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to create user");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

export const fetchAllUsers = async () => {
  try {
    const response = await fetch(`https://playground.4geeks.com/todo/users`);
    if (response.ok) {
      const data = await response.json();
      return data.users; // Return only the array of users
    } else {
      throw new Error("Failed to fetch all users");
    }
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
};

export const fetchUsersTasks = async (userName) => {
  try {
    const response = await fetch(
      `https://playground.4geeks.com/todo/users/${userName}`
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch tasks");
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const addTask = async (userName, task) => {
  try {
    const response = await fetch(
      `https://playground.4geeks.com/todo/todos/${userName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to add task");
    }
  } catch (error) {
    console.error("Error adding task:", error);
    return null;
  }
};

export const deleteTask = async (todoId) => {
  try {
    const response = await fetch(
      `https://playground.4geeks.com/todo/todos/${todoId}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      return true;
    } else {
      throw new Error("Failed to delete task");
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    return false;
  }
};

export const updateTask = async (todoId, updatedTask) => {
  try {
    const response = await fetch(
      `https://playground.4geeks.com/todo/todos/${todoId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to update task");
    }
  } catch (error) {
    console.error("Error updating task:", error);
    return null;
  }
};
