import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query'], // keep this to prove only ONE query runs
});

// ✅ FIXED: No N+1, single query with include
export async function getOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
    },
  });

  return orders;
}

// ✅ FIXED: Also optimized single order fetch
export async function getOrderById(id) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });

  return order;
}