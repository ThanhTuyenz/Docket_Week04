const express = require('express');
const app = express();

app.get('/api/other-service', (req, res) => {
    console.log('fakeService: received request');
    res.status(500).json({ error: 'Simulated error' }); // luôn lỗi để breaker hoạt động
});

app.listen(4000, () => {
    console.log('✅ Fake service running at http://localhost:4000');
});