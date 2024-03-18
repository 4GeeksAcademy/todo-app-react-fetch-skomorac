import React, { useState, useEffect } from "react";
import {
  createUserTodoList,
  getUserTodoList,
  updateUserTodoList,
  deleteUserTodoList
} from "./testApi";
import { Analytics } from "@vercel/analytics/react"

const generateUniqueId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [todoItems, setTodoItems] = useState([]);
  const [userName, setUserName] = useState("");
  const [showDeleteAllButton, setShowDeleteAllButton] = useState(false);

  useEffect(() => {
    // Clear username when component mounts
    setUserName("");
  }, []);

  useEffect(() => {
    // Show delete all button if there are tasks
    setShowDeleteAllButton(todoItems.length > 0);
  }, [todoItems]);

  const handleAddTask = async () => {
    if (inputValue.trim() !== "") {
      const newTask = {
        done: false,
        id: generateUniqueId(),
        label: inputValue.trim()
      };
      setTodoItems([...todoItems, newTask]);
      setInputValue("");

      try {
        await updateUserTodoList(userName, [...todoItems, newTask]);
      } catch (error) {
        console.error('Error updating todo list:', error);
      }
    } else {
      alert("Task can't be empty");
    }
  };

  const handleEnter = async (e) => {
    if (e.key === "Enter") {
      try {
        const response = await getUserTodoList(userName);
        if (response.ok) {
          alert("User already exists. Fetching todo items...");
          const data = await response.json();
          setTodoItems(data);
        }
      } catch (error) {
        console.error('Error retrieving todo list:', error);
        console.log("User does not exist. Creating new user...");
        try {
          await createUserTodoList(userName);
          alert("New user created successfully. Now you can add your tasks");
        } catch (error) {
          console.error('Error creating new user:', error);
        }
      }
    }
  };

  const handleDeleteAllTasks = async () => {
    try {
      await deleteUserTodoList(userName);
      setTodoItems([]);
      alert('No more tasks left, user is going to be deleted');
      window.location.reload(); // Reload the page after deleting all tasks
    } catch (error) {
      console.error('Error deleting all tasks:', error);
    }
  };

  // Function to handle deletion of a task
  const handleDeleteTask = async (index) => {
    const updatedTodoItems = [...todoItems];
    updatedTodoItems.splice(index, 1);
    setTodoItems(updatedTodoItems);

    try {
      if (updatedTodoItems.length === 0) {
        // If no tasks remaining, delete user's todo list
        await deleteUserTodoList(userName);
        alert('No more tasks left. User will be deleted');
        window.location.reload(); // Reload the page after deleting the last task
      } else {
        // If tasks remaining, update the todo list
        await updateUserTodoList(userName, updatedTodoItems);
        console.log('Todo list updated successfully.');
      }
    } catch (error) {
      console.error('Error updating/deleting todo list:', error);
    }
  };

  return (
    <div className="container">
      <h1>
        {todoItems.length === 0 ? (
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter user name"
            onKeyUp={handleEnter}
          />
        ) : (
          `${userName}'s To Do list`
        )}
      </h1>
      <div>
        Tasks left to complete: <strong>{todoItems.length}</strong>
      </div>
      <ul>
        <li>
          <input
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleAddTask();
              }
            }}
            placeholder={
              todoItems.length === 0
                ? "No tasks, add a task"
                : "Type to add more tasks"
            }
          />
        </li>
        {todoItems.map((item, index) => (
          <li key={index}>
            {item.label}{" "}
            <i
              className="fas fa-trash"
              onClick={() => handleDeleteTask(index)}
            ></i>
          </li>
        ))}
      </ul>
      {showDeleteAllButton && (
        <button className="deleteButton" onClick={handleDeleteAllTasks}>Delete All Tasks</button>
      )}
      <Analytics />
    </div>
  );
};

export default Home;
