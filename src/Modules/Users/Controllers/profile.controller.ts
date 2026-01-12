import { Router } from "express";
import { authentication, Multer } from "../../../Middleware";
import profileService from "../Services/profile.service";
const profileController = Router();


// update profile
profileController.put("/update-profile", authentication, profileService.updateProfile)

// delete profile
profileController.delete("/delete-account", authentication, profileService.deleteAccount)

// get profile data
profileController.get('/get-profile', authentication, profileService.getProfile)
// upload profile picture
profileController.post("/upload-profile", authentication, Multer().single("profilePicture"), profileService.uploadProfilePicture)

// upload cover picture

// list all users 
profileController.get('/list-users', profileService.listUsers)
// renew signed url 
profileController.post("/renew-signed-url", authentication, profileService.renewSignedUrl)

// send friend request

// list friend requests

// respond to friend request

// create group


export {profileController};