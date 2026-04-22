const prisma = require('../prisma/client');

// ✅ PURCHASE ITEM (FINAL VERSION)
async function purchaseItem(req, res) {
  try {
    const { userId, productId, quantity } = req.body;

    // 🔹 Validation
    if (!userId || !productId || !quantity) {
      return res.status(400).json({ error: "userId, productId, quantity required" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: "Invalid quantity" });
    }

    console.log("Purchase:", { userId, productId, quantity });

    // 🔹 Find product
    const product = await prisma.product.findUnique({
      where: { id: Number(productId) }
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!product.isActive) {
      return res.status(400).json({ error: "Product is not available" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Not enough stock" });
    }

    // ✅ TRANSACTION
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId: Number(userId),
          totalAmount: product.price * quantity,
          items: {
            create: [
              {
                productId: product.id,
                quantity: quantity,
                price: product.price
              }
            ]
          }
        },
        include: {
          items: true
        }
      });

      await tx.product.update({
        where: { id: product.id },
        data: {
          stock: {
            decrement: quantity
          }
        }
      });

      return createdOrder;
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Checkout failed" });
  }
}

// ✅ GET ORDERS BY USER
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

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { purchaseItem, getOrdersByUser };