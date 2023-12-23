import { Router } from "express";
import { verifyAccessToken } from "../middleware/verifyToken.js";
import { createCategory, getCategory, getDetailCategory } from "../controllers/Category.js";
import { CreateComments, deleteCommentsByUser, getCommentsByUser, updateCommentsByUser } from "../controllers/comments.js";

 const commentRouter = Router()
commentRouter.post('/', verifyAccessToken, CreateComments)
commentRouter.delete('/:id', verifyAccessToken, deleteCommentsByUser)
commentRouter.get('/', getCommentsByUser)
commentRouter.put('/:id',verifyAccessToken, updateCommentsByUser)




export default commentRouter
