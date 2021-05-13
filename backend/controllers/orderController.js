import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItem, shippingAddress } = req.body;
  var now = new Date();
  var expiredDate = now.setDate(now.getDate() + 2);
  if (!orderItem) {
    res.status(400);
    throw new Error('No book requested!');
  } else {
    const order = new Order({
      orderItem,
      buyer: req.user.email,
      seller: orderItem.seller,
      shippingAddress,
      expiredAt: expiredDate,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/complete
// @access  Private
const updateOrderToCompleted = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isCompleted = true;
    order.completedAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/arrange
// @access  Private/Admin
const updateOrderToArranged = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isArranged = true;
    order.arrangedAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const start = req.query.startDate;
  const end = req.query.endDate;
  var queryKeys = { buyer: req.user.email };
  var dateKeys = { createdAt: {} };
  //build Mongo query filter

  if (start !== '' && start !== 'null') {
    dateKeys['createdAt']['$gte'] = start;
  }
  if (end !== '' && end !== 'null') {
    dateKeys['createdAt']['$lte'] = end;
  }
  if (Object.keys(dateKeys['createdAt']).length === 0) {
    queryKeys = { buyer: req.user.email };
  } else {
    queryKeys = { ...{ buyer: req.user.email }, ...dateKeys };
  }
  const orders = await Order.find({
    ...queryKeys,
  });

  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Create new review to order and the seller as well
// @route   POST /api/orders/:id/reviews
// @access  Private
const createOrderReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const order = await Order.findById(req.params.id);
  console.log(req.user);
  if (order) {
    if (order.review) {
      res.status(400);
      throw new Error('This order already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    order.review = review;

    await order.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Order or Seller not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/reviews/:id
// @access  Private
const getMySoldOrders = asyncHandler(async (req, res) => {
  const start = req.query.startDate;
  const end = req.query.endDate;
  var queryKeys = { buyer: req.user.email };
  var dateKeys = { createdAt: {} };
  //build Mongo query filter
  if (start !== '' && start !== 'null') {
    dateKeys['createdAt']['$gte'] = start;
  }
  if (end !== '' && end !== 'null') {
    dateKeys['createdAt']['$lte'] = end;
  }
  if (Object.keys(dateKeys['createdAt']).length === 0) {
    queryKeys = { seller: req.user.email };
  } else {
    queryKeys = { ...{ seller: req.user.email }, ...dateKeys };
  }
  const orders = await Order.find({
    ...queryKeys,
  });

  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToCompleted,
  updateOrderToArranged,
  getMyOrders,
  getOrders,
  getMySoldOrders,
  createOrderReview,
};
