
const exp = require("express")
//mini 
const doctorApp = exp.Router()
const expressAsyncHandler = require("express-async-handler")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Doctor = require("../models/Doctor")
doctorApp.use(exp.json())
var cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const otpGenerator = require("otp-generator")
//cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const fileStorage = new CloudinaryStorage({
    cloudinary: cloudinary, params: async (req, file) => {
        return {
            folder: 'image',
            public_id: file.fieldname + '-' + Date.now()
        }
    }
})

const imageUpload = multer({ storage: fileStorage })


//create user - post 

doctorApp.post("/createdoctor", imageUpload.single('image'), expressAsyncHandler(async (req, res) => {

    //get  new user
    let newDoctor = JSON.parse(req.body.doctorObj)
    let imageCDN = req.file.path;
    const doctorObjFromDb = await Doctor.findOne({ username: newDoctor.username })

    if (doctorObjFromDb != null) {
        res.send({ message: "username already exist" })
    }
    else {
        // before inserting hasing the password
        let hashedPassword = await bcryptjs.hash(newDoctor.password, 5);
        //replace plain password wiht hashed
        newDoctor.password = hashedPassword
        //create new doc
        newDoctor.imgUrl = imageCDN;
        const newDoc = new Doctor({ ...newDoctor })
        let newDoctorForDb = await newDoc.save()
        console.log("doctor id created");
        res.send({ message: "doctor id created", payload: newDoctorForDb })
    }

}))
//login doctor
doctorApp.post("/login", expressAsyncHandler(async (req, res) => {

    //get  new doctor
    let loginDoctor = req.body
    //find doctor from username
    let doctorWaitingToLogin = await Doctor.findOne({ username: loginDoctor.username })
    //if doctor not found
    if (doctorWaitingToLogin == null) {
        res.send({ message: "doctor not found" })
    }
    // if doctor found 
    else {
        //compare passwords
        let status = await bcryptjs.compare(loginDoctor.password, doctorWaitingToLogin.password)
        // if password not matched
        if (status == false) {
            res.send({ message: "invalid password" })
        }
        //if passwords match , create token and send response
        else {
            let signedToken = await jwt.sign({ username: doctorWaitingToLogin.username }, process.env.SECRET_KEY, { expiresIn: 100 })
            res.status(200).send({ message: "login success", token: signedToken, doctor: doctorWaitingToLogin })
        }

    }
}))

//get doctors list
//get doctors
doctorApp.get('/getdoctors', expressAsyncHandler(async (req, res) => {

    //we have to call on model and no need toArray //if any thing returns query try to use exec() method on them
    //exec() is optional
    let doctors = await Doctor.find().exec()

    res.send({ message: "doctorsData", payload: doctors })
}))

//get  doctors by username
//get user by username
doctorApp.get('/getdoctors/:username', expressAsyncHandler(async (req, res) => {
    //get username from url
    let usernameFromUrl = req.params.username
    //find user by username
    let doctorFromDb = await Doctor.findOne({ username: usernameFromUrl }).exec()

    //if user not found, it returns null
    if (doctorFromDb == null) {
        res.send({ message: "doctor not found" })
    }
    //if user existed
    else {
        res.send({ message: "doctor existed", payload: doctorFromDb })
    }

}))
//edit profile
doctorApp.put("/updatedoctor/:username", expressAsyncHandler(async (req, res) => {
    let updatedDoctorObj = req.body;
    let usernameFromUrl = req.params.username;
    await Doctor.findOneAndUpdate({ username: usernameFromUrl }, { $set: { name: updatedDoctorObj.name } })
    await Doctor.findOneAndUpdate({ username: usernameFromUrl }, { $set: { consultationFee: updatedDoctorObj.consultationFee } })
    await Doctor.findOneAndUpdate({ username: usernameFromUrl }, { $set: { phoneno: updatedDoctorObj.phoneno } })
    await Doctor.findOneAndUpdate({ username: usernameFromUrl }, { $set: { city: updatedDoctorObj.city } })
    await Doctor.findOneAndUpdate({ username: usernameFromUrl }, { $set: { specialization: updatedDoctorObj.specialization } })
    await Doctor.findOneAndUpdate({ username: usernameFromUrl }, { $set: { experience: updatedDoctorObj.experience } })
    let finalUpdated = await Doctor.findOne({ username: usernameFromUrl })
    res.send({ message: "Doctor updated succesfully", payload: finalUpdated })
}))

// add appointment details to doctors list in backend
doctorApp.put('/getdoctors/:doctorname', expressAsyncHandler(async (req, res) => {
    //getting doctor name from the url 
    let doctornameFromUrl = req.params.doctorname
    //get the body from the req
    let appointmentObj = req.body
    //find the doctor object and update the 
    let doctorObj = await Doctor.findOne({ username: doctornameFromUrl })
    if (doctorObj != null) {
        await Doctor.updateOne({ username: doctornameFromUrl }, { $push: { appointmentDetails: appointmentObj } })

        let doctor1 = await Doctor.findOne({ username: doctornameFromUrl })
        res.send({ message: "doctor updated!", payload: doctor1 })

    }
    else {
        res.send({ message: "doctor doesn't exist" })
    }
}))


// update wallet of doctor after user payment 
doctorApp.put('/updatewallet/:doctorname', expressAsyncHandler(async (req, res) => {
    //getting doctor name from the url 
    let doctornameFromUrl = req.params.doctorname
    //get the body from the req
    let walletUpdateValue = req.body.doctorWalletAddition
    console.log(walletUpdateValue)
    //find the doctor object and update the 
    let doctorObj = await Doctor.findOne({ username: doctornameFromUrl })
    if (doctorObj != null) {
        await Doctor.updateOne({ username: doctornameFromUrl }, { $set: { wallet: walletUpdateValue + doctorObj.wallet } })

        let doctorUpdated = await Doctor.findOne({ username: doctornameFromUrl })
        res.send({ message: "doctor wallet updated!", payload: doctorUpdated })

    }
    else {
        res.send({ message: "doctor doesn't exist" })
    }
}))

//change password

doctorApp.put("/updatepassword/:usernameD", expressAsyncHandler(async (req, res) => {

    let usernameFromUrl = req.params.usernameD
    let oldPassword = req.body.oldpasswordD
    let userObj = await Doctor.findOne({ username: usernameFromUrl })
    if (userObj == null) {
        res.send("doctor not found")
    }
    else {
        let password = userObj.password
        let status = await bcryptjs.compare(oldPassword, password)
        if (status == false) {
            res.send({ message: "password mismatch" })
        }
        else {

            let newPassword = req.body.newpasswordD
            let hashedPassword = await bcryptjs.hash(newPassword, 5)
            if (hashedPassword == null) {
                res.send({ message: "hashing failed" })
            }
            else {
                let updatedObj = await Doctor.updateOne({ username: usernameFromUrl }, { $set: { password: hashedPassword } })
                if (updatedObj == null) {
                    res.send({ message: "password update failed " })
                }
                else {
                    res.send({ message: "password matched and new password updated" })
                }

            }

        }
    }


}))

//forgot password
doctorApp.post("/forgotpassword/:usernameF", expressAsyncHandler(async (req, res) => {

    let usernameFromUrl = req.params.usernameF;
    let userObj = await Doctor.findOne({ username: usernameFromUrl })
    if (userObj == null) {
        res.send({ message: "doctor not found (from forgot password req handler)" })
    }
    else {
        if(usernameFromUrl.phonenumberF !== userObj.phoneno){
            console.log("Invalid phone number fp doc");
            res.send({message:"Invalid phone number fp doc"})
        }
        else{
        let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        res.send({ message: "please type otp on modal from doctor api", payload: otp })
        }
    }



}))

//login parse handler - forgot password and otp matched comes here
doctorApp.post("/loginfp/:usernameF",expressAsyncHandler(async (req, res) => {

    let loginUser = req.body
    let userWaitingToLogin = await Doctor.findOne({ username: loginUser.usernameF })
    //if  not found
    if (userWaitingToLogin == null) {
        res.send({ message: "doctor not found (from login fp req handler)" })
    }
    // if  found 
    else {
        if (loginUser.phonenumberF == userWaitingToLogin.phoneno) {
            let signedToken = await jwt.sign({ username: userWaitingToLogin.usernameF }, process.env.SECRET_KEY, { expiresIn: 100 })
            res.send({ message: "login success", token: signedToken, doctor: userWaitingToLogin })
        }
        else{
            res.send({message:"invalid phone number"})
        }
        }

    }
))


//path not available middleware
doctorApp.use((req, res, next) => {
    res.send({ message: `path ${req.url} is not found` })
})


//error handling middleware
doctorApp.use((err, req, res, next) => {
    res.send({ message: "error!", payload: err.message })
})


//export
module.exports = doctorApp