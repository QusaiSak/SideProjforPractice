import React, { useEffect, useState } from 'react';
import './App.css';
import { useProductContext } from './context/context'

function App() {
  const { products, addProduct, addStock } = useProductContext();
  const [newProduct, setNewProduct] = useState({ code: '', title: '', description: '' });
  const [stockInfo, setStockInfo] = useState({ productCode: '', quantity: 0 });

  // Handle adding a new product
  const handleAddProduct = async () => {
    if (newProduct.code && newProduct.title && newProduct.description) {
      try {
        await addProduct(newProduct);
        setNewProduct({ code: '', title: '', description: '' }); // Reset form
        console.log('Product added successfully:', newProduct); // Add debugging
      } catch (error) {
        console.error('Error adding product:', error); // Add error handling
        alert('Failed to add product: ' + error.message);
      }
    } else {
      alert('Please fill in all fields (code, title, and description)');
    }
  };

  // Handle adding stock to an existing product
  const handleAddStock = async () => {
    if (stockInfo.productCode && stockInfo.quantity > 0) {
      await addStock(stockInfo.productCode, stockInfo);
      setStockInfo({ productCode: '', quantity: 0 }); // Reset stock form
    } else {
      alert('Please provide a valid product code and stock quantity');
    }
  };

  // Add useEffect to monitor products changes
  useEffect(() => {
    console.log('Products updated:', products);
  }, [products]);

  return (
    <div className="App">
      <h1>Product Management</h1>

      {/* Product Form */}
      <div>
        <h2>Add New Product</h2>
        <input
          type="text"
          placeholder="Code"
          value={newProduct.code}
          onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
        />
        <input
          type="text"
          placeholder="Title"
          value={newProduct.title}
          onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      {/* Stock Form */}
      <div>
        <h2>Add Stock</h2>
        <select
          value={stockInfo.productCode}
          onChange={(e) => setStockInfo({ ...stockInfo, productCode: e.target.value })}
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.code} value={product.code}>
              {product.title} ({product.code})
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Quantity"
          value={stockInfo.quantity}
          onChange={(e) => setStockInfo({ ...stockInfo, quantity: parseInt(e.target.value) || 0 })}
        />
        <button onClick={handleAddStock}>Add Stock</button>
      </div>

      {/* Product List */}
      <div>
        <h2>Products</h2>
        <ul>
          {products.map((product) => (
            <li key={product.code}>
              {product.title} - Code: {product.code} - Stock: {product.stockCount || 0}
              {product.active ? ' (Active)' : ' (Inactive)'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
