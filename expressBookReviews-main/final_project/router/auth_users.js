const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = {};

const isValid = (username) => {
  return true; 
}

const authenticatedUser = (username, password) => {
  return users[username] && users[username].password === password;
}

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, 'your-secret-key', { expiresIn: '1h' });

    req.session.authorization = { accessToken: token };

    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Authentication failed" });
  }
});


regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review; 
    if (!req.session.authorization) {
      return res.status(401).json({ message: "User not logged in" });
    }
  
    const username = req.session.authorization.username;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!books[isbn].reviews[username]) {
      books[isbn].reviews[username] = review;
    } else {
      books[isbn].reviews[username] = review;
    }
  
    return res.status(200).json({ message: "Review added/modified successfully" });
  });
  
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.user.username;

  if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
