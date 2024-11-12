const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;
const domain = 'http://localhost:3080';

// New user registration
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user. Set username and password."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Task 10
public_users.get('/async/', async function (req, res) {
  try {
    const response = await axios.get(domain + "/");
    res.status(200).json({"books": response.data});
  }
  catch(error) {
    res.status(400).json({"error": error.message});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if (books[isbn]) {
    return res.send(JSON.stringify(books[isbn],null,4));
  } else {
    res.status(404).json({message: "Unable to find a book."});
  }
});

// Task 11
public_users.get('/async/isbn/:isbn', async function (req, res) {
  let isbn = req.params.isbn;
  try {
    const response = await axios.get(domain + "/isbn/" + isbn);
    res.status(200).json(response.data);
  }
  catch(error) {
    res.status(400).json({"error": error.message});
  }
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let filteredBooks = [];

  Object.keys(books).forEach((key) => {
    if (books[key].author === author) {
      filteredBooks.push(books[key]);
    }
  });

  if (filteredBooks.length > 0) {
    return res.send(JSON.stringify(filteredBooks,null,4));
  } else {
    res.status(404).json({message: "No books found."});
  }
});

// Task 11
public_users.get('/async/author/:author', async function (req, res) {
  let author = req.params.author;
  try {
    const response = await axios.get(domain + "/author/" + author);
    res.status(200).json(response.data);
  }
  catch(error) {
    res.status(400).json({"error": error.message});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filteredBooks = [];

  Object.keys(books).forEach((key) => {
    if (books[key].title === title) {
      filteredBooks.push(books[key]);
    }
  });

  if (filteredBooks.length > 0) {
    return res.send(JSON.stringify(filteredBooks,null,4));
  } else {
    res.status(404).json({message: "No books found."});
  }
});

// Task 12
public_users.get('/async/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(domain + "/title/" + title);
    res.status(200).json(response.data);
  }
  catch(error) {
    res.status(400).json({"error": error.message});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params['isbn'];
  if (books[isbn] !== undefined) {
    return res.send(JSON.stringify(books[isbn].reviews,null,4));
  } else {
    res.status(404).json({message: "Unable to find a book."});
  }
});

module.exports.general = public_users;
