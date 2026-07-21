const express = require('express');
const cors = require('cors');
const { processPayUPayment } = require('./api/payu');

const app = express();
const port = 3000;

app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Payment Hash Generation Endpoint
app.post('/payment', (req, res) => {
    try {
        const data = req.body;
        
        console.log("\n====== Official PayU Hash Request ======");
        console.log(`User: ${data.firstName} | Email: ${data.email}`);
        console.log("========================================\n");

        const payuConfigData = processPayUPayment(data);
        res.json({ success: true, ...payuConfigData });
    } catch (error) {
        console.error("API Processing Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// PayU Response Handling Endpoint (No SMTP - Screen Display)
app.post('/response', (req, res) => {
    try {
        const { status, txnid, amount, firstname } = req.body;

        console.log(`\n====== Transaction Callback Webhook ======`);
        console.log(`ID: ${txnid} | Status: ${status} | Buyer: ${firstname}`);
        console.log("==========================================\n");

        if (status === 'success') {
            res.send(`<h1>Payment Successful! 🎉</h1><p>Thank you ${firstname}, your payment of $${amount} USD was processed.</p>`);
        } else {
            res.send(`<h1>Payment Failed! ❌</h1><p>Transaction with ID ${txnid} was declined.</p>`);
        }
    } catch (error) {
        console.error("Callback Route Error:", error);
        res.status(500).send("Error processing response");
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
