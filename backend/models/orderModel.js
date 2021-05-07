import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const orderSchema = mongoose.Schema(
  {
    buyer: { type: String, required: true },
    seller: { type: String, required: true },
    orderItem: {
      name: { type: String, required: true },
      seller: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
    },

    reviews: [reviewSchema],
    shippingAddress: {
      address: { type: String, required: true },
      dateTime: { type: String, required: true },
      postalCode: { type: String, required: true },
    },

    isCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
