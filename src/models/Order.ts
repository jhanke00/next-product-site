import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    user: { type: String, required: true },
    items: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        count: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
