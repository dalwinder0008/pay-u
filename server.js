const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS so frontend can communicate with backend
app.use(cors({
    origin: "http://127.0.0.1:5500"
}));

// Middleware to parse incoming JSON data
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
    res.send('Server is running perfectly!');
});

// Simple POST Route
app.post('/payment', (req, res) => {
    const data = req.body;

    // Terminal par data print hoga
    console.log("====== New Payment Request ======");
    console.log("First Name: ", data.firstName);
    console.log("Last Name:  ", data.lastName);
    console.log("Email:      ", data.email);
    console.log("Card Number:", data.cardnumber);
    console.log("CVV:        ", data.cvvnumber);
    console.log("Amount:     ", data.amount);
    console.log("=================================");

    // Response send to frontend
    res.json({
        success: true,
        message: "Data received successfully on local server"
    });
});

// Start the Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
