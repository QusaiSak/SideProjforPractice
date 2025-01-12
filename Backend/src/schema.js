const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    code: {type:String,required:true,unique:true},
    title: {type:String,required:true},
    description: {type:String,required:true},
    active: {type:Boolean,default: true},
});

const StockSchema = new Schema({
    productCode: {type: String, ref: 'Product', required: true},
    quantity: {type: Number, required: true, default: 0},
});


const ProductModel = mongoose.model('Product',ProductSchema);
const StockModel = mongoose.model('Stock',StockSchema);

module.exports = { ProductModel , StockModel };