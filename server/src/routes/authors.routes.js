import { Router } from "express";
import { list } from "../controllers/authors.controller.js";

const router = Router();
router.get("/", list);
export default router;
