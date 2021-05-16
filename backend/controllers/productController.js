import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const status = req.query.status;
  console.log("query.keyword:"+req.query.keyword)
  console.log("query.status:"+req.query.status)
  var [prefix, keyword] = req.query.keyword.split('_');
  if (keyword) {
    switch (prefix) {
      case 'title':
        keyword = {
          name: {
            $regex: keyword,
            //lowercase or uppercase insensitive
            $options: 'i',
          },
        };
        break;
      case 'author':
        keyword = {
          author: {
            $regex: keyword,
            //lowercase or uppercase insensitive
            $options: 'i',
          },
        };
        break;
      case 'category':
        keyword = {
          category: {
            $regex: keyword,
            //lowercase or uppercase insensitive
            $options: 'i',
          },
        };
        break;
      default:
        break;
    }
  } else {
    keyword = {};
  }
  if (status) {
    keyword['status'] = status;
  }
  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    //eg. if page is 3, then skip the first 2 pages' products
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch on sale products by seller
// @route   GET /api/myproducts/
// @access  Public
const getMyProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Product.countDocuments({
    sellerEmail: req.user.sellerEmail,
  });
  const products = await Product.find({
    sellerEmail: req.user.email,
    status: req.query.status,
  })
    .limit(pageSize)
    //eg. if page is 3, then skip the first 2 pages' products
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id.match(/^[0-9a-fA-F]{20,26}$/)) {
    throw new Error('Invalid id format!');
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const idValue = req.params.id;
  if (idValue.match(/^[0-9a-fA-F]{20-26}$/)) {
    throw new Error('Invalid id format!');
  }
  const user = req.user;
  const product = await Product.findById(req.params.id);

  if (product) {
    //check if this delete action allowed. only admin or the seller can delete the book
    if (product.sellerEmail === user.email || user.isAdmin) {
      product.status = 'deleted'
      await product.save();
      res.json({ message: 'Product removed!' });
    } else {
      res.status(404);
      throw new Error('Action not authorized!');
    }
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    author,
    category,
    condition,
    status,
  } = req.body;
  if (price < 0) {
    throw new Error('price must >= 0!');
  }
  const product = new Product({
    name: name,
    price: price,
    sellerEmail: req.user.email,
    image: image,
    author: author,
    category: category,
    condition: condition,
    description: description,
    status: status,
  });

  const createdProduct = await product.save();
  res.status(200).json(createdProduct);
});

// @desc    Update the status of a book
// @route   PUT update/status/:id
// @access  Private
const updateProductStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  await Product.updateOne(
    { _id: req.params.id },
    { status: status },
    (err, res) => {
      if (err) {
        throw new Error(err);
      }
    }
  );
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    author,
    category,
    condition,
  } = req.body;

  const product = await Product.findById(req.params.id);
  const user = req.user;
  if (product) {
    //check if this update action allowed. only the seller can update the book
    if (product.sellerEmail == user.email) {
      product.name = name;
      product.price = price;
      product.sellerEmail = req.user.email;
      product.description = description;
      product.image = image;
      product.author = author;
      product.category = category;
      product.condition = condition;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Action not authorized!');
    }
  } else {
    res.status(404);
    throw new Error('Product not found!');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ status: 'selling' })
    .sort({ rating: -1 })
    .limit(3);

  res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getTopProducts,
  getMyProducts,
  updateProductStatus,
};
