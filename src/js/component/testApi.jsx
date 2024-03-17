  import React from "react";
  
  export const createUserTodoList = async (username) => {
    try {
        const response = await fetch(`https://playground.4geeks.com/apis/fake/todos/user/${username}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([]) // Empty todo list initially
        });
        if (response.ok) {
            console.log('Todo list created successfully.');
        } else {
            console.error('Failed to create todo list:', response.statusText);
        }
    } catch (error) {
        console.error('Error creating todo list:', error);
    }
};



export const updateUserTodoList = async (username, todoItems) => {
    try {
        const response = await fetch(`https://playground.4geeks.com/apis/fake/todos/user/${username}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todoItems)
        });
        if (response.ok) {
            console.log('Todo list updated successfully.');
        } else {
            console.error('Failed to update todo list:', response.statusText);
        }
    } catch (error) {
        console.error('Error updating todo list:', error);
    }
};

export const getUserTodoList = async (username) => {
    try {
        const response = await fetch(`https://playground.4geeks.com/apis/fake/todos/user/${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        // Check if the response is ok
        if (!response.ok) {
            throw new Error('Failed to retrieve todo list: ' + response.statusText);
        }
        
        return response; // Return the response object if successful
    } catch (error) {
        throw new Error('Error retrieving todo list: ' + error.message); // Throw an error if request fails
    }
};




export const deleteUserTodoList = async (username) => {
    try {
        const response = await fetch(`https://playground.4geeks.com/apis/fake/todos/user/${username}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            console.log('Todo list deleted successfully.');
        } else {
            console.error('Failed to delete todo list:', response.statusText);
        }
    } catch (error) {
        console.error('Error deleting todo list:', error);
    }
};
