const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
let users = [];

const isValid = (username)=>{ //returns boolean
let existingUser=users.filter((user)=>user.username===username);
if(existingUser){return true;}
return false;
}

const authenticatedUser = (username, password) => {
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    if(!books[isbn]){return res.status(404).json({message: "Book not found"})}
    const review=req.query.review;
    if(!review){return res.status(400).json({message: "Review cannot be empty."})}
    const username=req.session.authorization['username'];
    if(!username){return res.status(400).json({message: "Invalid user. Please log in."})}
    books[isbn].reviews[username]=review;

    return res.status(200).json({message:'Book review submitted successfully', reviews: books[isbn].reviews});
});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
    const isbn = req.params.isbn;
    if(!books[isbn]){return res.status(404).json({message: "Book not found"})}
    const username=req.session.authorization['username'];
    if(!username){return res.status(400).json({message: "Invalid user. Please log in."})}
    if(!books[isbn].reviews[username]){return res.status(400).json({message: "You haven't reviewed this book yet."})}
    delete books[isbn].reviews[username];
    return res.status(200).json({message: "Review deleted successfully.", reviews: books[isbn].reviews})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
