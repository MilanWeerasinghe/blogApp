import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import cors from 'cors';
//Routes
import userRoutes from './routes/userRoutes.js';


dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res)=>{
    res.send("server is running....");
});
app.use('/api/user', userRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>(
    console.log(`server is running on port ${PORT}`)
));


