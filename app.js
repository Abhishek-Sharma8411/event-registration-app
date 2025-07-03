import mongoose from "mongoose";
import session from "express-session";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./src/db/db.js";
import path from "path";
import { fileURLToPath } from "url";
import { Student } from "./models/student.models.js";
import { Event } from "./models/event.model.js";
import { sendConfirmationEmail } from "./src/db/utils/mail.js";
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

// Session config
app.use(session({
    secret: process.env.ADMIN_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: true,
}));

// Serve login page
app.get("/admin-login", (req, res) => {
    res.sendFile("admin-login.html", { root: "public" });
});

// Handle login form POST
app.post("/admin-login", (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        req.session.admin = true;
        res.redirect("/admin.html");
    } else {
        res.send("<h3>Incorrect Password</h3><a href='/admin-login'>Try again</a>");
    }
});

// Protect /admin route
app.get("/admin", (req, res) => {
    if (req.session.admin) {
        res.sendFile("/admin.html", { root: "public" });
    } else {
        res.redirect("/admin-login");
    }
});

// app.use("/admin", adminRoutes);

// Handle student form submission
app.post("/register", async (req, res) => {
    try {
        const { participatedIn, ...rest } = req.body;

        // Create student with linked event ID
        const student = await Student.create({
            ...rest,
            participatedIn: new mongoose.Types.ObjectId(participatedIn),
        });

        // Fetch full event details
        const event = await Event.findById(participatedIn);

        // ✅ Send confirmation email with logging
        console.log("📩 Attempting to send email to:", student.email);
        await sendConfirmationEmail(student, event);
        console.log("✅ Email sent successfully to:", student.email);

        // Redirect on success
        res.redirect("/thanks.html");

    } catch (err) {
        console.error("❌ Registration error:", err);

        // Duplicate entry handler
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            return res.status(400).send(`
                <h3 style="color:red;">Error: A student with this ${field} already exists!</h3>
                <a href="/student.html">Go back to form</a>
            `);
        }

        // Generic error
        res.status(500).send(`
            <h3 style="color:red;">An unexpected error occurred.</h3>
            <pre>${err.message}</pre>
            <a href="/student.html">Go back to form</a>
        `);
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
