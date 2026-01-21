import { Router } from "express";
import { authentication } from "../../Middleware";
import reactService from "./Services/react.service";

const reactController = Router();

// Add react OR update react
reactController.post( "/add", authentication, reactService.react);

// Remove react
reactController.delete("/remove", authentication, reactService.unReact);

// List reactions on post or comment
reactController.get("/list",authentication, reactService.listReactions);

export { reactController };