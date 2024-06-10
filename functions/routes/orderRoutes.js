const express = require('express');
const Order= require('../model/orderModel');
const router = express.Router();

//get
router.get('/', async (req,res)=>{
  try{
    const orders = await Order.find();
    res.json(orders);
  }catch(err){
    res.status(500).json({message:err.message});
  }
});

router.get('/:id', getOrders,(req,res)=>{
  res.json(res.order);
})

router.post('/', async (req,res)=>{
  try{
    if(!req.body.customerName || !req.body.email || !req.body.productName){
      return res.status(400).json({message:'Please fill all required fields'})
    }

    const order = new Order(req.body);
    const newOrder = await order.save();

    res
      .status(200)
      .json({message: 'Order created successfully', order:newOrder});
  }catch(err){
    res.status(400).json({message: err.message});
  }
})

router.put('/:id',getOrders, async (req, res)=>{
  try{
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
    );

    res.json(updatedOrder);
  }catch(err){
    res.status(400).json({message: err.message});
  }
});

router.delete('/:id', getOrders, async (req,res)=>{
  try{
    await Order.findByIdAndDelete(req.params.id);
    res.json({message: 'Order is deleted sucessfully'});
  }catch(err){
    res.status(500).json({message:err.message});
  }
});

async function getOrders(req,res,next){
  try{
    const order = await Order.findById(req.params.id);
    if(!order){
      return res.status(404).json({message:'Order not found'});
    }
    res.order = order;
    next();
  }catch(err){
    res.status(500).json({message:err.message});
  }
}

module.exports = router;