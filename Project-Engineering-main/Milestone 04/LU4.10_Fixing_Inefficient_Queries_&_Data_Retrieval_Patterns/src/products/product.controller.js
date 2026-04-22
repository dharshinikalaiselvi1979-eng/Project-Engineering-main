import { getProducts, getProductById } from './product.service.js';

export async function listProducts(req, res) {
  try {
    // ✅ Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: 'Invalid page or limit' });
    }

    // ✅ Sorting
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'desc' ? 'desc' : 'asc';

    // ✅ Field selection
    const fields = req.query.fields;

    // ✅ Call service correctly
    const result = await getProducts({
      page,
      limit,
      sortBy,
      order,
      fields,
    });

    res.json(result);
  } catch (err) {
    console.error(err);

    // ✅ Validation errors from service
    res.status(400).json({ error: err.message });
  }
}

export async function getProduct(req, res) {
  try {
    const id = parseInt(req.params.id);

    // ✅ Validate ID
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}