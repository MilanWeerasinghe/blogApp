import express from "express";
const router = express.Router();
import {register, login, userProfile, updateProfile, updateProfilePicture} from '../controllers/userControllers.js';
import { authGuard } from "../middleware/userAuth.js";

router.post('/register',register);
router.post('/login',login);
router.get('/profile',authGuard,userProfile);
router.put('/updateProfile',authGuard, updateProfile);
router.put('/updateProfilePicture', authGuard, updateProfilePicture);

export default router;