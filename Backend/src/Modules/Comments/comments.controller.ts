import { Router } from "express";
import commentService from "./Services/comments.service";
import { authentication, Multer } from "../../Middleware";
const commentController = Router();

// Add comment
commentController.post('/add', authentication, Multer().single('file'), commentService.addCommentOrReply)

// Update comment

// Delete comment

// Get all comments

// Get comment by id

// Get all comments for specific post

export { commentController }