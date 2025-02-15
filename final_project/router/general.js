const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist=(username)=>{
  let userswithsamename = users.filter((user) => {
    return user.username === username;
});
// Return true if any user with the same username is found, otherwise false
if (userswithsamename.length > 0) {
    return true;
} else {
    return false;
}
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const myPromise = new Promise((resolve,reject)=>{
    const allBooks=books;
    if(allBooks){
      resolve(allBooks);
    }
    else{
      error="Books data not found."
      reject(error)
    }
  });
  myPromise
  .then((allBooks)=>{return res.send(JSON.stringify(allBooks));})
  .catch((error)=>{return res.status(404).json({message:error})});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const myPromise=new Promise((resolve,reject)=>{
    let filtered_book=books[isbn];
    if (filtered_book){
      resolve(filtered_book);
    }
    else{
      error="Book with this ISBN not found.";
      reject(error);
    };
   });
   myPromise
   .then((filtered_book)=>{return res.send(JSON.stringify(filtered_book));})
   .catch((error)=>{return res.status(404).json({message:error})});
  });
  

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author=req.params.author;
  const myPromise=new Promise((resolve,reject)=>{
    let filtered_books=Object.values(books).filter((book)=>book.author===author);
    if(filtered_books){
      resolve(filtered_books);
    }
    else{
      error="No books found by this author.";
      reject(error);
    }
  });
  myPromise
  .then((filtered_books)=>{return res.send(JSON.stringify(filtered_books));})
  .catch((error)=>{return res.status(404).json({message:error})});
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title=req.params.title;
  const myPromise=new Promise((resolve,rject)=>{
    let filtered_books=Object.values(books).filter((book)=>book.title===title);
    if(filtered_books){
      resolve(filtered_books);
    }
    else{
      error="No book found with this title."
      reject(error)
    }
  });
  myPromise
  .then((filtered_books)=>{return res.send(JSON.stringify(filtered_books));})
  .catch((error)=>{return res.status(404).json({message:error})});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let filtered_book=books[isbn];
  if(filtered_book){
    return res.send(JSON.stringify(filtered_book.reviews));
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
