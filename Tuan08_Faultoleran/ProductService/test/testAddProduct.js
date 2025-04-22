const axios = require('axios');

async function testCreateProduct() {
    try {
        const response = await axios.post('http://localhost:3000/api/products', {
            name: "Test Product",
            price: 99.99,
            description: "This is a test product",
            stock: 100
        });
        console.log('Product created successfully:', response.data);
    } catch (error) {
        console.error('Error creating product:', error.response?.data || error.message);
    }
}

testCreateProduct();