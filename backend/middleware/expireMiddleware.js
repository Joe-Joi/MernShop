import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import mongoose from 'mongoose';
const handleExpiredOrders = async () => {
  // find expiredOrders

  const expiredOrders = await Order.find({
    expiredAt: { $lt: new Date() },
    isArranged: false,
    isCompleted: false,
    isExpired: false,
  });
  const session = await mongoose.startSession();

  //set expiredOrders as expired and set book as selling
  await session
    .withTransaction(async () => {
      expiredOrders.map(async (order) => {
        await Product.updateOne(
          { _id: order.orderItem.product },
          { status: 'selling' }
        ).session(session);
        await Order.updateOne({ _id: order._id }, { isExpired: true }).session(
          session
        );
      });
    })
    .catch(() => session.endSession());
};

export default handleExpiredOrders;
