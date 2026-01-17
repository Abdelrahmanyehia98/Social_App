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

// Upload cover pictures

// list all users 
profileController.get('/list-users', profileService.listUsers)
// renew signed url 
profileController.post("/renew-signed-url", authentication, profileService.renewSignedUrl)

// send friend request
profileController.post('/send-friend-request', authentication, profileService.sendFriendShipRequest)

// list friend requests
profileController.get('/list-friend-requests', authentication, profileService.listRequests)

// respond to friend request
profileController.patch('/respond-to-friend-request', authentication, profileService.respondToFriendShipRequest)

// create group
profileController.post("/create-group", authentication, profileService.createGroup)

export {profileController};