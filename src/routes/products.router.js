import { Router } from "express";
import productModel from "../models/product.model.js";
import { PaginationParameters } from "mongoose-paginate-v2";

const router = Router();

const PATH = "http://localhost:8080/api/products";

// GET paginado
router.get("/products", async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  let filter = {};
  if (query === "true" || query === "false") {
    filter.status = query === "true";
  } else if (query) {
    filter.category = query;
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    lean: true,
  };

  if (sort === "asc") options.sort = { price: 1 };
  if (sort === "desc") options.sort = { price: -1 };

  const result = await productModel.paginate(filter, options);

  const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;
  const prevLink = result.hasPrevPage
    ? `${baseUrl}?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}`
    : null;
  const nextLink = result.hasNextPage
    ? `${baseUrl}?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}`
    : null;

  res.render("index", {
    products: result.payload,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    prevLink,
    nextLink,
  });
});


// POST nuevo producto
router.post("/products", async (req, res) => {
  const product = await productModel.create(req.body);
  res.status(201).json(product);
});

// GET por ID
router.get("/products/:pid", async (req, res) => {
  const product = await productModel.findById(req.params.pid).lean();
  if (!product) return res.status(404).send("Producto no encontrado");
  res.render("product", product);
});


// PUT actualizar
router.put("/products/:pid", async (req, res) => {
  const updated = await productModel.findByIdAndUpdate(req.params.pid, req.body, {
    new: true,
  });
  updated
    ? res.json(updated)
    : res.status(404).json({ error: "Producto no encontrado" });
});

// DELETE eliminar
router.delete("/products/:pid", async (req, res) => {
  const deleted = await productModel.findByIdAndDelete(req.params.pid);
  deleted
    ? res.json({ mensaje: "Producto eliminado" })
    : res.status(404).json({ error: "Producto no encontrado" });
});

export default router;
