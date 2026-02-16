import express from "express";
import cors from "cors";

import authorsRoutes from "./routes/authors.routes.js";
import booksRoutes from "./routes/books.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/authors", authorsRoutes);
app.use("/api/books", booksRoutes);

app.listen(4000, () => console.log("Server started on http://localhost:4000"));
