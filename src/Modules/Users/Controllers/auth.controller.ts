import { Router } from "express";
import authService from "../Services/auth.service";
const authController = Router();

//sign up
authController.post('/signUp',authService.signUp)




export {authController};