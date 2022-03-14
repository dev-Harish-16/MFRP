//import mongoose
const mongoose = require("mongoose")

//create schema first - provides the shape 
const userSchema = new mongoose.Schema({
    username: { type: String, required: [true,"username is required"] },
    password: { type: String, required: [true,"password is required"] },
    email:{ type: String, required: [true,"email is required"] },
    city:{type: String , required:[true,"city is required"]},
    phoneno:{type: Number , required:[true,"Phone number is required"]},
    age:{type: Number , required:[true,"age is required"]},
    name:{type: String , required:[true,"Name is required"]},
    status:{type:Boolean, default:true},
    appointmentDetails:{type:Array},
    subscription:{type:String,default:''},
    wallet:{type:Number,default:0},
}, { collection: 'usercollection' })


//create  user model
const userModel = mongoose.model("user", userSchema)

//export model
module.exports = userModel