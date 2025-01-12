const express = require("express");
const { ProductModel, StockModel } = require("./schema");
const router = express.Router();

// Create a new product
router.post('/product', async (req, res) => {
    try {
        const { code, title, description } = req.body;
        
        // Validate required fields
        if (!code || !title || !description) {
            return res.status(400).send({ error: 'Missing required fields' });
        }

        // Check if product with same code exists
        const existingProduct = await ProductModel.findOne({ code });
        if (existingProduct) {
            return res.status(400).send({ error: 'Product code already exists' });
        }

        const product = new ProductModel({ code, title, description, active: false });
        const saved = await product.save();
        res.status(201).send(saved);
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).send({ error: err.message });
    }
});

// Get all products with stock information
router.get('/product', async (req, res) => {
    try {
        const products = await ProductModel.aggregate([
            {
                $lookup: {
                    from: 'stocks',
                    localField: 'code',
                    foreignField: 'productCode',
                    as: 'stockInfo',
                },
            },
            {
                $addFields: {
                    stockCount: {
                        $reduce: {
                            input: '$stockInfo',
                            initialValue: 0,
                            in: { $add: ['$$value', '$$this.quantity'] },
                        },
                    },
                    active: {
                        $gt: [
                            {
                                $reduce: {
                                    input: '$stockInfo',
                                    initialValue: 0,
                                    in: { $add: ['$$value', '$$this.quantity'] },
                                },
                            },
                            0,
                        ],
                    },
                },
            },
            {
                $project: {
                    code: 1,
                    title: 1,
                    description: 1,
                    stockCount: 1,
                    active: 1,
                },
            },
        ]);
        res.status(200).send(products);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Create new stock for a product
router.post('/addstock', async (req, res) => {
    try {
        const { productCode, quantity } = req.body;

        // Verify product exists
        const product = await ProductModel.findOne({ code: productCode });
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }

        // Create a new stock entry
        const newStock = new StockModel({ productCode, quantity });
        const savedStock = await newStock.save();

        // Update the product's active status based on stock quantity
        const activeStatus = savedStock.quantity > 0;
        await ProductModel.findOneAndUpdate(
            { code: productCode },
            { active: activeStatus }
        );

        res.status(201).send(savedStock);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
