//install exp 

const exp = require("express")
const app = exp()
//.env
require ("dotenv").config()
//import mongoose
const userApp = require("./APIs/userApp")
const doctorApp = require("./APIs/doctorApp")
const mongoose = require("mongoose")

//import path
const path = require("path")

//connect angular build with web server
app.use(exp.static(path.join(__dirname,"./dist/medico")))

const databaseConnectionUrl = process.env.DATABASE_URL;
//connecting to database
mongoose.connect(databaseConnectionUrl)
.then(()=>console.log(`connected to db`))
.catch (err=>console.log("error in db connect",err))













app.use("/user", userApp)
app.use("/doctor", doctorApp)


 //catch all other routes and return the index file
app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,'dist/medico/index.html'))
})

// port 
const PORT = process.env.PORT
app.listen(PORT, ()=>console.log(`web server listening on port ${PORT}`))