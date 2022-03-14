const jwt = require('jsonwebtoken')

require("dotenv").config()

const verifyToken=(req,res,next)=>{
    //get bearer token
    console.log(req.headers.authorization)
    let bearerToken = req.headers.authorization;

    //if undefined
    if(bearerToken == undefined){
        res.send({message:"unauthorised request"})
    }

    else{
        let token = bearerToken.split(" ")[1]

        //verify
        try{
            jwt.verify(token,process.env.SECRET_KEY)
    
            next()
        }
        catch(err){
            next(new Error("session expired...relogin to continue"))
            //res.send({message:"session expired"})
        }
    }
    //extract token
   
}

module.exports = verifyToken