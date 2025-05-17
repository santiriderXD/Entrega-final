import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";

dotenv.config();

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Rutas
app.use("/api", productRouter);
app.use("/api", cartRouter);

app.get("/", (req, res) => {
  res.render("index");
});

// MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`Database Mongo connected successfully`);
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(console.error);