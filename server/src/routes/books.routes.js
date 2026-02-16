import { Router } from "express";
import * as C from "../controllers/books.controller.js";

const router = Router();

router.get("/", C.list);        // GET /api/books?authorId=1
router.get("/:id", C.getById);  // GET /api/books/:id
router.post("/", C.create);     // POST /api/books
router.put("/:id", C.update);   // PUT /api/books/:id
router.delete("/:id", C.remove);// DELETE /api/books/:id

export default router;
