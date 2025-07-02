// // routes/student.routes.js

// import express from "express";
// import mongoose from "mongoose";
// import { Student } from "../models/student.models.js";
// import { Event } from "../models/event.model.js";

// const router = express.Router();

// // ✅ View All Events (for dropdown)
// router.get("/events", async (req, res) => {
//   const events = await Event.find();
//   res.json(events);
// });

// // ✅ Register Student
// router.post("/register", async (req, res) => {
//   try {
//     const { participatedIn, ...rest } = req.body;

//     const student = await Student.create({
//       ...rest,
//       participatedIn: new mongoose.Types.ObjectId(participatedIn),
//     });

//     res.redirect("/students.html");
//   } catch (err) {
//     console.error("❌ Registration Error:", err);

//     if (err.code === 11000) {
//       const duplicateField = Object.keys(err.keyPattern)[0];
//       res.status(400).send(`
//         <h3 style="color:red;">Duplicate ${duplicateField} already exists!</h3>
//         <a href="/student.html">Go back</a>
//       `);
//     } else {
//       res.status(500).send(`
//         <h3 style="color:red;">An unexpected error occurred.</h3>
//         <pre>${err.message}</pre>
//         <a href="/student.html">Go back</a>
//       `);
//     }
//   }
// });

// // ✅ Get All Students
// router.get("/students", async (req, res) => {
//   const students = await Student.find().populate("participatedIn");
//   res.json(students);
// });

// // ✅ Optional: Seed Default Events
// router.get("/seed-events", async (req, res) => {
//   try {
//     await Event.insertMany([
//       {
//         title: "Tech Fest",
//         description: "Annual inter-college tech competition",
//         startDate: "2025-08-01",
//         endDate: "2025-08-03",
//         location: "Main Auditorium"
//       },
//       {
//         title: "Hackathon",
//         description: "24-hour coding marathon",
//         startDate: "2025-09-15",
//         endDate: "2025-09-16",
//         location: "Computer Lab"
//       },
//       {
//         title: "Workshop",
//         description: "Hands-on AI & ML workshop",
//         startDate: "2025-10-10",
//         endDate: "2025-10-11",
//         location: "Seminar Hall"
//       }
//     ]);
//     res.send("✅ Events seeded successfully");
//   } catch (err) {
//     res.status(500).send("❌ Failed to seed events");
//   }
// });

// export default router;
