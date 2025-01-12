const mongoose = require('mongoose');
const { ProductModel , StockModel } = require("./src/schema");
require('dotenv').config()
const mongoURI = process.env.mongoURI;

const productsData = [
  { code: 'P001', title: 'Product 1', desc: 'Description for Product 1' },
  { code: 'P002', title: 'Product 2', desc: 'Description for Product 2' },
];

const stocksData = [
  { productId: null, quantity: 50 },
  { productId: null, quantity: 0 },
];

(async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await ProductModel.deleteMany();
    await StockModel.deleteMany();

    
    console.log('Products updated with active status');
    process.exit(0);
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
})();
