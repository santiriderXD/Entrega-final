import { Router } from "express";
import cartModel from "../models/cart.model.js";

const router = Router();

// Crear carrito
router.post("/carts", async (req, res) => {
  const newCart = await cartModel.create({});
  res.status(201).json(newCart);
});

// Obtener productos de un carrito
router.get("/carts/:cid", async (req, res) => {
  const cart = await cartModel.findById(req.params.cid).populate("products.product").lean();
  if (!cart) return res.status(404).send("Carrito no encontrado");
  res.render("cart", cart);
});


// Agregar producto a un carrito
router.post("/carts/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await cartModel.findById(cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

  const existingProduct = cart.products.find(p => p.product.toString() === pid);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.products.push({ product: pid });
  }
  await cart.save();
  res.json(cart);
});

// Actualizar carrito completo
router.put("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  const updated = await cartModel.findByIdAndUpdate(cid, { products }, { new: true });
  updated
    ? res.json(updated)
    : res.status(404).json({ error: "Carrito no encontrado" });
});

// Vaciar carrito completo
router.delete("/carts/:cid", async (req, res) => {
  const { cid } = req.params;

  const cart = await cartModel.findById(cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

  cart.products = []; // Vaciar productos
  await cart.save();

  res.json({ mensaje: "Productos eliminados del carrito", cart });
});

// Actualizar cantidad de un producto
router.put("/carts/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const cart = await cartModel.findById(cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

  const product = cart.products.find(p => p.product.toString() === pid);
  if (product) {
    product.quantity = quantity;
    await cart.save();
    res.json(cart);
  } else {
    res.status(404).json({ error: "Producto no encontrado en el carrito" });
  }
});

// Eliminar un producto del carrito
router.delete("/carts/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  const cart = await cartModel.findById(cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

  cart.products = cart.products.filter(p => p.product.toString() !== pid);
  await cart.save();
  res.json(cart);
});

export default router;
