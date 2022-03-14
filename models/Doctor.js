//import mongoose
const mongoose = require("mongoose")

//create schema first - provides the shape 
const doctorSchema = new mongoose.Schema({
    username: { type: String, required: [true, "username is required"] },
    password: { type: String, required: [true, "password is required"] },
    consultationFee: { type: Number, required: [true, "consultationFee is required"],default:600},
    city: { type: String, required: [true, "city is required"] },
    phoneno: { type: Number, required: [true, "Phone number is required"] },
    experience: { type: Number, required: [true, "experience is required"] },
    name: { type: String, required: [true, "Name is required"] },
    specialization: { type: String, required: [true, "specialization is required"] },
    status: { type: Boolean, default: true },
    appointmentDetails:{type:Array},
    wallet:{type:Number,default:0},
    imgUrl:{type:String}
}, { collection: 'doctorcollection' })

//create  doctor model

const doctorModel = mongoose.model("doctor", doctorSchema)

//export model
module.exports = doctorModel