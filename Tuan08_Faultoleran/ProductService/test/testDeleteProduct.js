const axios = require('axios');

const testDeleteProduct = async (id) => {
    try {
        const response = await axios.delete(`http://localhost:3000/api/products/${id}`);
        console.log('Product deleted successfully:', response.data);
    } catch (error) {
        console.error('Error deleting product:', error.response?.data || error.message);
    }
}

testDeleteProduct('67f4e55d851d0d59182ac63a');