import mongoose from "mongoose"

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber : {
        type: Number,
        required: true
    },
     department : {
        type: String,
        required: true
    },
     class : {
        type: String,
        required: true
    },
    participatedIn: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }
}, { timestamps: true })


export const Student = mongoose.model("Student", studentSchema);