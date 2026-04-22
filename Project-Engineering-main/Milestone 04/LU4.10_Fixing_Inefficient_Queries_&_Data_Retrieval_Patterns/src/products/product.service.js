import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ whitelist fields (adjust if your schema has more)
const allowedFields = ['id', 'name', 'price', 'createdAt'];

export async function getProducts({ page, limit, sortBy, order, fields }) {
  const skip = (page - 1) * limit;

  // ✅ validate sort field
  if (!allowedFields.includes(sortBy)) {
    throw new Error('Invalid sort field');
  }

  // ✅ field selection
  let select = undefined;

  if (fields) {
    const fieldArray = fields.split(',');

    const invalidFields = fieldArray.filter(f => !allowedFields.includes(f));
    if (invalidFields.length > 0) {
      throw new Error(`Invalid fields: ${invalidFields.join(',')}`);
    }

    select = {};
    fieldArray.forEach(f => {
      select[f] = true;
    });
  }

  // ✅ main query
  const products = await prisma.product.findMany({
    skip,
    take: limit,
    orderBy: { [sortBy]: order },
    select,
  });

  // ✅ total count
  const total = await prisma.product.count();

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: products,
  };
}

// ✅ keep this for single product
export async function getProductById(id) {
  return await prisma.product.findUnique({
    where: { id },
  });
}