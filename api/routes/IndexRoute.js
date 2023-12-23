import { Router } from "express";
import authRouter from "./Auth.js";
import  categoryRouter  from "./Category.js";
import commentRouter from "./Comments.js";

const router = Router()

router.use("/auth",authRouter)
router.use("/category",categoryRouter)
router.use("/comment",commentRouter)
export default router;