const prisma = require('../prisma/client');

// ✅ PURCHASE ITEM (FIXED)
async function purchaseItem(req, res) {
  try {
    const { userId, productId } = req.body;

    // 🔍 Check product exists
    const product = await prisma.product.findUnique({
      where: { id: Number(productId) }
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // 🔍 Check stock
    if (product.stock < 1) {
      return res.status(400).json({ error: "Out of stock" });
    }

    // ✅ TRANSACTION (VERY IMPORTANT)
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Order
      const order = await tx.order.create({
        data: {
          userId: Number(userId),
          totalAmount: product.price,
          items: {
            create: [
              {
                productId: product.id,
                quantity: 1,
                price: product.price
              }
            ]
          }
        },
        include: { items: true }
      });

      // 2. Update stock
      await tx.product.update({
        where: { id: product.id },
        data: {
          stock: {
            decrement: 1
          }
        }
      });

      return order;
    });

    res.status(201).json({ order: result });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ✅ GET ORDERS BY USER (WITH ITEMS)
async function getOrdersByUser(req, res) {
  try {
    const userId = Number(req.params.userId);

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { purchaseItem, getOrdersByUser };