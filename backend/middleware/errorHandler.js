export const errorHandler = (err, req, res , next)=>{
    const statusCode = err.statusCode || 400;
    res.status(statusCode).json({
        message:err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    })
}