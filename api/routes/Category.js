import { Router } from "express";
import { verifyAccessToken } from "../middleware/verifyToken.js";
import { createCategory, getCategory, getDetailCategory } from "../controllers/Category.js";

 const categoryRouter = Router()
categoryRouter.post('/', createCategory)
categoryRouter.get('/', getCategory)
categoryRouter.get('/:id', getDetailCategory)



export default categoryRouter
