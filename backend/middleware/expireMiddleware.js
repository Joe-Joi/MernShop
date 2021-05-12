import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import mongoose from 'mongoose';
const handleExpiredOrders = async () => {
  // set all expired orders as expired

  const expiredOrders = await Order.find({
    expiredAt: { $lt: new Date() },
    isArranged: false,
    isCompleted: false,
    isExpired: false,
  });
  const session = await mongoose.startSession();
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
