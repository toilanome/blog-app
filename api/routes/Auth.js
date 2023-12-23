import { Router } from "express";
import { getUserDetail, post, signIn, signUp,getPost, getSinglePage, updatePost, deletePost } from "../controllers/auth.js";
import { verifyAccessToken } from "../middleware/verifyToken.js";
import multer from 'multer'
const uploadMiddleware = multer({dest:'uploads/'});
const authRouter = Router()

authRouter.post('/signup', signUp)
authRouter.post('/signin', signIn)
authRouter.get('/userDetail',verifyAccessToken, getUserDetail)
authRouter.get('/getPost', getPost)
authRouter.post('/post',uploadMiddleware.single('file'),verifyAccessToken, post)
authRouter.get('/post/:id', getSinglePage)
authRouter.delete('/post/:id', deletePost)
authRouter.put('/post/:id',uploadMiddleware.single('file') ,verifyAccessToken, updatePost)



export default authRouter
