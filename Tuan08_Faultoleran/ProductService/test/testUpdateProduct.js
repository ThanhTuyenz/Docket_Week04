const axios = require('axios');

const getProductById = async (id) => {
    try {
        const response = await axios.put(`http://localhost:3000/api/products/${id}`, {
            name: "Test update product",
            price: 100.99,
            description: "This is a updated test product",
            stock: 1001
        });
        console.log('Product updated successfully:', response.data);
    } catch (error) {
        console.error('Error creating product:', error.response?.data || error.message);
    }

}

getProductById('67f4e514d73ea6cc76676edd');