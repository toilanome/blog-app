    import { Router } from "express";
    import { getUserDetail, post, signIn, signUp,getPost, getSinglePage, updatePost, deletePost } from "../controllers/auth.js";
    import { verifyAccessToken } from "../middleware/verifyToken.js";
    import { CloudinaryStorage } from "multer-storage-cloudinary";
    import multer from "multer";
    import cloudinary from "../configs/Cloud.js";

    const authRouter = Router()
    const storage = new CloudinaryStorage({
        cloudinary:cloudinary,
        folder: "BANK",
        allowedFormats : ['jpg','png', 'jpeg'],
        transformation: [{with: 500, height:500, crop:'limit'}]
    })
    const upload = multer({
        storage:storage
    })

    authRouter.post('/signup',upload.single('img'), signUp)
    authRouter.post('/signin', signIn)
    authRouter.get('/userDetail',verifyAccessToken, getUserDetail)
    authRouter.get('/getPost', getPost)
    authRouter.post('/post',upload.single('img'),verifyAccessToken, post)
    authRouter.get('/post/:id', getSinglePage)
    authRouter.delete('/post/:id', deletePost)
    authRouter.put('/post/:id',upload.single('img') ,verifyAccessToken, updatePost)



    export default authRouter
