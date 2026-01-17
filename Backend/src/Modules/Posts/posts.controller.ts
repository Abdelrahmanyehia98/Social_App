import { Router } from "express";
import { authentication, Multer } from "../../Middleware";
import postsService from "./Services/posts.service";
const postController = Router();

// Add post 
postController.post('/add', authentication, Multer().array('files', 3), postsService.addPost)

// Update post

// Delete post

// Get home posts
postController.get('/posts', authentication, postsService.listPosts)

// Get friends posts
postController.get('/friends-posts', authentication, postsService.listFriendsPosts)


export { postController }