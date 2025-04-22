const axios = require('axios');

const testAddOrder = async () => {
    try {
        const response = await axios.post('http://localhost:8080/api/orders', {
            customerId:'67f4eb15096d387833e28248',
            products: [
                {
                    productId: '67f4e4ffd73ea6cc76676eda',
                    quantity: 1
                },
                {
                    productId: '67f4e514d73ea6cc76676edd',
                    quantity: 2
                }
            ]
        });
        console.log('Order created successfully:', response.data);
    } catch (error) {
        console.error('Error creating order:', error.response?.data || error.message);
    }
}

testAddOrder();