import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const authGuard = async(req, res, next)=>{
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")){
        try{
            const token = req.headers.authorization.split(" ")[1];
            const {id} = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(id).select("-password");
            next();
        }catch(err){
            let error = new Error("Not authorized, Token invalid");
            error.statusCode = 401;
            next(error);
        }
    }
    else{
        let error = new Error("Not authorized, no token");
        error.statusCode = 401;
        next(error);
    }
}