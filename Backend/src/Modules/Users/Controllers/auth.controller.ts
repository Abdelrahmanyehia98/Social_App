import { Router } from "express";
import AuthService from "../Services/auth.service";
import { authentication, ValidatonMiddleware } from "../../../Middleware";
import { SignUpValidator } from "../../../Validators";
const authController = Router();

// signup
authController.post('/signUp',ValidatonMiddleware(SignUpValidator), AuthService.signUp)
// signin
authController.post('/signIn', AuthService.SignIn)
// confirm email
authController.post('/confirmEmail', authentication, AuthService.ConfirmEmail)

// forget password
authController.post('/forgetPassword', AuthService.forgetPassword)

// reset password
authController.post('/resetPassword', AuthService.resetPassword)

// update password 
authController.post('/updatePassword', authentication, AuthService.updatePassword)

// logout
authController.post('/logout', authentication, AuthService.logOut)
export {authController};