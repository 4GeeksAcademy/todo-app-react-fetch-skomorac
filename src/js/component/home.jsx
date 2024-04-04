import React, { useState } from "react";

import {
  createUser,
  fetchAllUsers,
  fetchUsersTasks,
  addTask,
  deleteTask,
  updateTask,
} from "./API";

import("../../styles/index.css");

const Home = () => {
  // State to store user name
  const [userName, setUserName] = useState("");
  // State to store tasks
  const [tasks, setTasks] = useState([]);
  // State to track whether username is submitted
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  // State to store new task
  const [newTask, setNewTask] = useState("");

  // Function to fetch tasks for the current user
  const fetchTasks = async () => {
    if (!userName) return; // If userName is empty, do nothing
    try {
      const data = await fetchUsersTasks(userName);
      setTasks(data.todos || []); // Set tasks to an empty array if no tasks are returned
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]); // Set tasks to an empty array if there is an error
    }
  };

  // Function to handle input change for user name
  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  // Function to handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Fetch tasks only if userName is not empty
    if (userName.trim() !== "") {
      try {
        // Fetch all users
        const allUsers = await fetchAllUsers();
        if (allUsers && allUsers.length > 0) {
          // Check if the user exists in the list of all users
          const userExists = allUsers.some((user) => user.name === userName);
          if (userExists) {
            console.log("User exists, fetching tasks...");
            fetchTasks(); // Fetch tasks for the existing user
          } else {
            console.log("User does not exist, creating user...");
            const newUser = await createUser(userName);
            if (newUser) {
              console.log("User created successfully:", newUser);
              fetchTasks(); // Fetch tasks for the newly created user
              setUsernameSubmitted(true); // Set usernameSubmitted to true after user creation
            } else {
              console.error("Failed to create user");
            }
          }
        } else {
          console.error("Failed to fetch all users");
        }
      } catch (error) {
        console.error("Error handling form submit:", error);
      }
    }
  };

  // Function to handle pressing Enter key
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  // Function to handle input change for new task
  const handleNewTaskChange = (event) => {
    setNewTask(event.target.value);
  };

  // Function to handle adding new task
  const handleAddTask = async () => {
    if (newTask.trim() !== "") {
      try {
        await addTask(userName, { label: newTask });
        fetchTasks(); // Fetch updated tasks after adding new task
        setNewTask(""); // Clear input field after adding task
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  // Function to delete all tasks associated with the user
  const deleteAllTasks = async () => {
    try {
      // Loop through tasks and delete each one
      tasks.forEach(async (task) => {
        await deleteTask(task.id);
      });
      // After all tasks are deleted, delete the user
      const response = await fetch(
        `https://playground.4geeks.com/todo/users/${userName}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        console.log("User deleted successfully");
        // Clear tasks and usernameSubmitted state
        setTasks([]);
        setUserName("");
        setUsernameSubmitted(false);
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Function to delete a task by its ID
  const deleteTaskById = async (todoId) => {
    try {
      const success = await deleteTask(todoId);
      if (success) {
        // Filter out the deleted task from tasks array
        const updatedTasks = tasks.filter((task) => task.id !== todoId);
        setTasks(updatedTasks);
        console.log("Task deleted successfully");
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Function to toggle the status of a task by its ID
  const toggleTaskStatus = async (todoId) => {
    try {
      // Find the task in tasks array
      const taskToUpdate = tasks.find((task) => task.id === todoId);
      // Toggle the is_done status
      taskToUpdate.is_done = !taskToUpdate.is_done;
      // Update the task using updateTask API function
      await updateTask(todoId, taskToUpdate);
      // Update the state of tasks with the modified task
      const updatedTasks = tasks.map((task) =>
        task.id === todoId ? taskToUpdate : task
      );
      setTasks(updatedTasks);
      console.log("Task status toggled successfully");
    } catch (error) {
      console.error("Error toggling task status:", error);
    }
  };

  return (
    <div className="container">
      {/* If username is submitted, show title and task input field */}
      {usernameSubmitted ? (
        <>
          <h1>{`${userName}'s todo list`}</h1>
          <input
            type="text"
            placeholder="Enter task"
            value={newTask}
            onChange={handleNewTaskChange}
            onKeyPress={(event) => {
              if (event.key === "Enter") handleAddTask();
            }}
          />
        </>
      ) : (
        // Show input field for entering username
        <h1>
          <input
            type="text"
            placeholder="Enter user name"
            value={userName}
            onChange={handleUserNameChange}
            onKeyPress={handleKeyPress} // Call handleSubmit on Enter key press
          />
        </h1>
      )}
      {/* Show the rest of the page only if userName is not empty */}
      {userName && (
        <>
          <div>
            Tasks left to complete: <strong>{tasks.length}</strong>
          </div>
          <ul>
            {tasks.map((task, index) => (
              <li key={index}>
                <span>
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={task.is_done}
                    onChange={() => toggleTaskStatus(task.id)}
                  />
                </span>
                <label className={task.is_done ? "lineThrough" : ""}>
                  {task.label}
                </label>
                <i
                  className="fas fa-trash"
                  onClick={() => deleteTaskById(task.id)}
                ></i>
              </li>
            ))}
          </ul>
          {tasks.length > 0 && (
            <button className="deleteButton" onClick={deleteAllTasks}>
              Delete All Tasks
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
