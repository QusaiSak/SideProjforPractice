import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const BASE_URL = "http://localhost:3001/store";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);

    // Fetch products from the backend
    const fetchRecords = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/product`);
            setProducts(response.data);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    // Add a new product
    const addProduct = async (record) => {
        try {
            const response = await axios.post(`${BASE_URL}/product`, record);
            await fetchRecords(); // Fetch updated list after adding
            return response.data;
        } catch (err) {
            console.error('Error adding product:', err);
            throw err; // Propagate error to component
        }
    };

    // Add stock to an existing product
    const addStock = async (productCode, stock) => {
        try {
            const response = await axios.post(`${BASE_URL}/addstock`, {
                productCode,
                quantity: stock.quantity
            });
            await fetchRecords(); // Fetch updated list after adding stock
            return response.data;
        } catch (err) {
            console.error('Error adding stock:', err);
            throw err; // Propagate error to component
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    return (
        <ProductContext.Provider value={{ products, addProduct, addStock }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error(
        "useProductContext must be used within a ProductProvider"
        );
    }
    return context;
};
