const prisma = require('../prisma/client');

// ✅ GET ALL PRODUCTS
async function getProducts(req, res) {
  try {
    const products = await prisma.product.findMany();

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ✅ GET PRODUCT BY ID
async function getProductById(req, res) {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id }
    });

    // ✅ NULL SAFETY (VERY IMPORTANT)
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product); // return full product
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// test change
module.exports = { getProducts, getProductById };