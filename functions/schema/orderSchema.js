
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Cancelled', 'Delivered'],
    default: 'Pending'
  }
});

module.exports = orderSchema;
