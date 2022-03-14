
const exp = require("express")
//mini 
const userApp = exp.Router()
const expressAsyncHandler = require("express-async-handler")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
userApp.use(exp.json())
const verifyToken = require("../middlewares/verifyToken")
const otpGenerator = require("otp-generator")

//create user - post (signup)

userApp.post("/createuser", expressAsyncHandler(async (req, res) => {

    //get  new user
    let newUser = req.body

    let userObjFromDb = await User.findOne({ username: newUser.username })

    if (userObjFromDb != null) {
        res.send({ message: "username already exist" })
    }
    else {
        // before inserting hasing the password
        let hashedPassword = await bcryptjs.hash(newUser.password, 5);
        //replace plain password wiht hashed
        newUser.password = hashedPassword;

        //create new doc

        const newDocument = new User({ ...newUser })

        let newUserForDb = await newDocument.save()
        console.log("user created");

        res.send({ message: "user created", payload: newUserForDb })
    }

}))
//login user
userApp.post("/login", expressAsyncHandler(async (req, res) => {

    //get  new user
    let loginUser = req.body
    //find user from username
    let userWaitingToLogin = await User.findOne({ username: loginUser.username })
    //if user not found
    if (userWaitingToLogin == null) {
        res.send({ message: "user not found" })


    }
    // if user found 
    else {
        //compare passwords (user typed data,db data)
        let status = await bcryptjs.compare(loginUser.password, userWaitingToLogin.password)
        // if password not matched
        if (status == false) {
            res.send({ message: "invalid password" })
        }
        //if passwords match , create token and send response
        else {
            let signedToken = await jwt.sign({ username: userWaitingToLogin.username }, process.env.SECRET_KEY, { expiresIn: 10000 })
            //create url


            res.send({ message: "login success", token: signedToken, user: userWaitingToLogin })
        }

    }
}))
//get user by username
userApp.get('/getuser/:username', expressAsyncHandler(async (req, res) => {
    //get username from url
    let usernameFromUrl = req.params.username
    //find user by username
    let userFromDb = await User.findOne({ username: usernameFromUrl }).exec()

    //if user not found, it returns null
    if (userFromDb == null) {
        res.send({ message: "user does not found" })
    }
    //if user existed
    else {
        res.send({ message: "user existed", payload: userFromDb })
    }

}))

//update wallet
userApp.put("/wallet/:username", verifyToken, expressAsyncHandler(async (req, res) => {
    //get username from url
    let userFromUrl = req.params.username
    let wallet1 = req.body.wallet
    await User.findOneAndUpdate({ username: userFromUrl }, { $set: { wallet: wallet1 } })
    let updateUser = await User.findOne({ username: userFromUrl }).exec()
    res.send({ message: "updated user", payload: updateUser })
}))
//appointment details adding
userApp.put('/userdashboard/:username', verifyToken, expressAsyncHandler(async (req, res) => {
    console.log(req.headers)
    let usernameFromUrl = req.params.username;
    let appointmentObj = req.body
    let userFromDb = await User.findOne({ username: usernameFromUrl }).exec()
    if (userFromDb == null) {
        res.send({ message: "user doesnt exist" })
    }
    else {
        await User.updateOne({ username: usernameFromUrl }, { $push: { appointmentDetails: appointmentObj } })
        res.send({ message: "successfully updated", payload: { appointmentObj } })
    }

}))

//edit profile
userApp.put("/updateuser/:username", verifyToken, expressAsyncHandler(async (req, res) => {
    //console.log("from backend")
    //res.send({message:"from backend this msg has come"})
    let updatedUserObj = req.body;
    let usernameFromUrl = req.params.username;
    await User.findOneAndUpdate({ username: usernameFromUrl }, { $set: { name: updatedUserObj.name } })
    await User.findOneAndUpdate({ username: usernameFromUrl }, { $set: { age: updatedUserObj.age } })
    await User.findOneAndUpdate({ username: usernameFromUrl }, { $set: { phoneno: updatedUserObj.phoneno } })
    await User.findOneAndUpdate({ username: usernameFromUrl }, { $set: { city: updatedUserObj.city } })

    let finalUpdated = await User.findOne({ username: usernameFromUrl })
    res.send({ message: "user updated succesfully", payload: finalUpdated })
}))

//change password

userApp.put("/updatepassword/:username", verifyToken, expressAsyncHandler(async (req, res) => {

    let usernameFromUrl = req.params.username
    let oldPassword = req.body.oldpassword
    let userObj = await User.findOne({ username: usernameFromUrl })
    if (userObj == null) {
        res.send("user not found")
    }
    else {
        let password = userObj.password
        let status = await bcryptjs.compare(oldPassword, password)
        if (status == false) {
            res.send({ message: "password mismatch" })
        }
        else {

            let newPassword = req.body.newpassword
            let hashedPassword = await bcryptjs.hash(newPassword, 5)
            if (hashedPassword == null) {
                res.send({ message: "hashing failed" })
            }
            else {
                let updatedObj = await User.updateOne({ username: usernameFromUrl }, { $set: { password: hashedPassword } })
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
//forgot password otp generation
userApp.post("/forgotpassword/:usernameF", expressAsyncHandler(async (req, res) => {

    let usernameFromUrl = req.body;
    let userObj = await User.findOne({ username: usernameFromUrl.usernameF })
    if (userObj == null) {
        res.send({ message: "user not found" })
    }
    else {
        if(usernameFromUrl.phonenumberF !== userObj.phoneno){
            console.log("Invalid phone number fp");
            res.send({message:"Invalid phone number fp"})
        }
        else{
            let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
            res.send({ message: "please type otp on modal", payload: otp })
        }
      
    }



}))

//login parse handler - forgot password and otp matched comes here
userApp.post("/loginfp/:usernameF", expressAsyncHandler(async (req, res) => {

    let loginUser = req.body
    let userWaitingToLogin = await User.findOne({ username: loginUser.usernameF })
    //if user not found
    if (userWaitingToLogin == null) {
        res.send({ message: "user not found" })
    }
    // if user found 
    else {
        console.log(loginUser.phonenumberF,"loginuser");
        console.log(userWaitingToLogin.phoneno,"userwaiting");
        if (loginUser.phonenumberF == userWaitingToLogin.phoneno) {
            let signedToken = await jwt.sign({ username: userWaitingToLogin.usernameF }, process.env.SECRET_KEY, { expiresIn: 100 })
            res.send({ message: "login success", token: signedToken, user: userWaitingToLogin })
        }
        else{
            res.send({message:"invalid phone number"})
        }
    }

}
))

//update SUbscription
userApp.put('/userdashboard/subscription/:username',expressAsyncHandler(async (req,res)=>{
    let usernameFromUrl=req.params.username;
    let subscriptionfromObj=req.body.subscription;
    let userFromDb = await User.findOne({ username: usernameFromUrl }).exec()
    if (userFromDb == null) {
        res.send({ message: "user dosent exist" })
    }
    else {
        await User.updateOne({ username: usernameFromUrl }, { $set: {subscription: subscriptionfromObj } })
        res.send({ message: "successful", payload: { userFromDb } })
    }
}))



//path not available middleware
userApp.use((req, res, next) => {
    res.send({ message: `path ${req.url} is not found` })
})


//error handling middleware
userApp.use((err, req, res, next) => {
    res.send({ message: "error!", payload: err.message })
})


//export
module.exports = userApp