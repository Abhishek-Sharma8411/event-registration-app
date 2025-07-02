// import dotenv from "dotenv"
// import express from "express"
// import connectDB from "./src/db/db.js";

// dotenv.config()
// connectDB()

// const app = express();

// app.listen(process.env.PORT || 8000, ()=>{
//     console.log(`Server running on port : ${process.env.PORT}`)
// })
import mongoose from "mongoose";

import dotenv from "dotenv";
import express from "express";
import connectDB from "./src/db/db.js";
import path from "path";
import { fileURLToPath } from "url";
import { Student } from "./models/student.models.js";
import { Event } from "./models/event.model.js"; // optional now
dotenv.config();

connectDB();

const app = express();
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

app.get("/events", async (req, res) => {
    const events = await Event.find();
    res.json(events);
});

// Handle student form submission
app.post("/register", async (req, res) => {
    try {
        const { participatedIn, ...rest } = req.body;

        const student = await Student.create({
            ...rest,
            participatedIn: new mongoose.Types.ObjectId(participatedIn),
        });

        res.redirect("/students.html"); // success case

    } catch (err) {
        console.error("❌ Error occurred during registration:", err); // log full error

        if (err.code === 11000) {
            const duplicateField = Object.keys(err.keyPattern)[0];
            res.status(400).send(`
      <h3 style="color: red;">Error: A student with that ${duplicateField} already exists!</h3>
      <a href="/student.html">Go back to form</a>
    `);
        } else {
            res.status(500).send(`
      <h3 style="color: red;">An unexpected error occurred.</h3>
      <pre>${err.message}</pre>
      <a href="/student.html">Go back to form</a>
    `);
        }
    }
});

// Return all registered students
app.get("/students", async (req, res) => {
    const students = await Student.find().populate("participatedIn"); // if you used ref
    res.json(students);
});

app.listen(process.env.PORT || 8000, () => {
    console.log(`✅ Server running on port: ${process.env.PORT || 8000}`);
});
