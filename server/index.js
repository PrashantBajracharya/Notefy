import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UsersModel from "./models/Users.js";
import NotesModel from "./models/Notes.js";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import validator from "email-validator";
import session from "express-session";
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.DATABASE);
app.use(session({
  secret: process.env.KEY, // Secret used to sign the session ID cookie
  resave: false, // Save session data on every request, even if it hasn't changed
  saveUninitialized: true, // Save new sessions that haven't been modified
  // You can configure other options like store, cookie, etc.
}));

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, password, reenterPassword, email } = req.body;

    if (!firstName || !lastName || !password || !reenterPassword || !email) {
      return res.status(400).json({message: "Enter values for all fields."});
    }

    if(!validator.validate(email)) {
      return res.status(400).json({message: "Enter a valid email."});
    }

    if(password !== reenterPassword) {
      return res.status(400).json({message: "Passwords don't match."});
    }

    if (!(password.length >= 8 && password.length <= 12)) {
      return res.status(400).json({message: "Password must be between 8 and 12 characters."});
    }

    const existingUser = await UsersModel.findOne({ email: email });
    if(existingUser) {
      return res.status(409).json({ message: "User already exists." });
    } 

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = UsersModel.create({
      ...req.body,
      password: hashedPassword
    });

    return res.status(200).json(user);
  } 
  
  catch (error) {
    res
      .status(500)
      .json({
        message: "An unexpected error occurred. Please try again later.",
      });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UsersModel.findOne({ email: email });

    if (!email || !password) {
      return res.status(400).json({message: "Enter values for all fields."});
    }

    if(!validator.validate(email)) {
      return res.status(400).json({message: "Enter a valid email."});
    }

    if (!(password.length >= 8 && password.length <= 12)) {
      return res.status(400).json({message: "Password must be between 8 and 12 characters."});
    }

    if(!user) {
      return res.status(401).json({ message: "Invalid login credentials." });
    }

    bcrypt.compare(password, user.password).then((result) => {
      if (result === true) {
        req.session.userId = user._id;
        console.log(req.session.userId)
        res.json({ message: "Success", user:user._id });
      } 
      
      else {
        res
          .status(401)
          .json({ message: "The password you entered is incorrect." });
      }
    });
  } 
  
  catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({
        message: "An unexpected error occurred. Please try again later.",
      });
  }
});


app.post("/addnote", async (req, res) => {
  try {
    // Check if userId exists in session
    console.log(req.session.userId)
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized. Please login." });
    }

    // Create a note for the user
    const newNote = await NotesModel.create({
      userId: req.session.userId, // Assign the userId from session
      notes: req.body, // Use the entire req.body as the note
    });

    return res.status(201).json(newNote);
  } catch (error) {
    console.error("Error adding note:", error);
    return res
      .status(500)
      .json({ message: "An unexpected error occurred. Please try again later." });
  }
});

app.post('/logout', (req, res) => {
  try {
    // Destroy the session associated with the user
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ message: 'Logout failed' });
      }
      // Session destroyed successfully
      return res.status(200).json({ message: 'Logout successful' });
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
});

app.listen(3000, () => console.log("Server is running on port 3000!"));