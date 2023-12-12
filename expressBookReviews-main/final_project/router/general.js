const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Get the book list available in the shop using async-await with Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('https://ohamdy1999-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai'); 
    const books = response.data;
    return res.status(200).json(JSON.stringify({ books }, null, 2));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get book details based on ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const response = await axios.get(`https://ohamdy1999-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books/isbn/${req.params.isbn}`); 
    const book = response.data;
    return res.status(200).json(JSON.stringify({ book }, null, 2));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get book details based on author using async-await with Axios
public_users.get('/author/:author', async function (req, res) {
  try {
    const response = await axios.get(`https://ohamdy1999-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books/author/${req.params.author}`); 
    const booksByAuthor = response.data;
    return res.status(200).json(JSON.stringify({ books: booksByAuthor }, null, 2));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all books based on title using async-await with Axios
public_users.get('/title/:title', async function (req, res) {
  try {
    const response = await axios.get(`https://ohamdy1999-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books/title/${req.params.title}`); 
    const booksByTitle = response.data;
    return res.status(200).json(JSON.stringify({ books: booksByTitle }, null, 2));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const book = books[req.params.isbn];
  if (book && book.reviews) {
    return res.status(200).json(JSON.stringify({ reviews: book.reviews }, null, 2));
  } else {
    return res.status(404).json({ message: "Reviews not found for the book" });
  }
});

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users[username]) {
    return res.status(400).json({ message: "Username already exists" });
  } else {
    users[username] = { username, password };
    return res.status(200).json({ message: "Registration successful" });
  }
});

module.exports.general = public_users;
