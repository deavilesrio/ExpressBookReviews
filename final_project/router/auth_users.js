const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
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
  //Write your code here
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
        }, 'access', { expiresIn: 60 });

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
  //Write your code here
  const isbn = req.params.isbn;
  let book = books[isbn]; 
  if (book) {  // Check if book exists

    let userName = req.query.username;
    let review = req.query.review;
    // Update review if provided in request body
    if (review && userName) {
      books[isbn].reviews[userName] = review;
    }
   

    
    res.send(`Book with the isbn ${isbn} updated.`);
  } else {
      // Respond if book with specified email is not found
      res.send("Unable to find book!");
  }
  
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Extract isbn parameter from request URL
  //Write your code here
  const isbn = req.params.isbn;
  const userName = req.body.username;
  let book = books[isbn]; 
  if (book) {  // Check if book exists

    // Update review if provided in request body
    if (book.reviews && userName) {
      delete book.reviews[userName];
    }
  }
  
  // Send response confirming deletion of book
  res.send(`Review from book ${isbn} with username ${userName} has been deleted`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
