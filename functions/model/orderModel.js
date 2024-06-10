const mongoose = require('mongoose');
const orderSchema = require('../schema/orderSchema');

const OrderModel = mongoose.model('Order',orderSchema);

module.exports = OrderModel;