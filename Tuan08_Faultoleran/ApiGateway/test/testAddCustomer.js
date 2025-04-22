const axios = require('axios');

const testAddCustomer = async () => {
    try {
        const response = await axios.post('http://localhost:8080/api/customers', {
            name: 'John Doe',
            address: '123 Main St',
            phone: '555-555-5555',
            email: 'johndoedasdlasjkd@gmail.com', 
        })
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

testAddCustomer();