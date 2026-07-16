server.js

const express = require('express');
const cors = require('cors');
const { initiatePayUPayment } = require('./.api/payu');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/process-payment', (req, res) => {
    const userData = req.body;

    // .api folder se function call kiya
    const payuData = initiatePayUPayment(userData);

    console.log("Processing PayU payment for:", userData.firstName);
    
    res.json({
        success: true,
        ...payuData
    });
});

app.post('/payment/success', (req, res) => {
    console.log("Payment completed successfully.");
    res.send("<h1>Payment Successful!</h1>");
});

app.post('/payment/failure', (req, res) => {
    console.log("Payment failed or cancelled.");
    res.send("<h1>Payment Failed!</h1>");
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});




pay.uapi

const crypto = require('crypto');

const KEY = "v7ZP0D"; 
const SALT = "Gd0WkF1HOA76KOnVoZzAodKbzkZdnPLd";
const URL = "https://test.payu.in/_payment";

function initiatePayUPayment(userData) {
    const txnid = "T" + Date.now(); // Ekdum chota unique ID
    const prod = "Items"; // Short product info
    
    // Sirf zaroori fields ka hash string
    const hashStr = `${KEY}|${txnid}|${userData.amount}|${prod}|${userData.firstName}|${userData.email}|||||||||||${SALT}`;
    const hash = crypto.createHash('sha512').update(hashStr).digest('hex');

    return {
        payuUrl: URL,
        payuParams: {
            key: KEY,
            txnid: txnid,
            amount: userData.amount,
            productinfo: prod,
            firstname: userData.firstName,
            lastname: userData.lastName,
            email: userData.email,
            phone: "9999999999", 
            surl: "http://localhost:3000/payment/success", 
            furl: "http://localhost:3000/payment/failure", 
            hash: hash
        }
    };
}

module.exports = { initiatePayUPayment };




script.js



const paymentForm = document.getElementById('paymentForm');

paymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Input values ko perfectly read karne ke liye variables
    const amount = document.getElementById('amount').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;

    const formData = {
        amount: amount,
        firstName: firstName,
        lastName: lastName,
        email: email
    };

    try {
        // Aapke chalte hue Node server (Port 3000) ko hit karein
        const res = await fetch('http://localhost:3000/api/process-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await res.json();

        // Check karein agar parameters undefined toh nahi aa rahe
        if (result.success && result.payuParams) {
            
            // PayU redirection ke liye invisible hidden form setup
            const payuForm = document.createElement('form');
            payuForm.action = result.payuUrl;
            payuForm.method = 'POST';

            // Saare incoming params ko dynamic inputs banayein
            for (const key in result.payuParams) {
                if (result.payuParams.hasOwnProperty(key)) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = result.payuParams[key];
                    payuForm.appendChild(input);
                }
            }

            // Append to body and push to PayU Gateway
            document.body.appendChild(payuForm);
            payuForm.submit();
        } else {
            alert('Invalid parameters returned from server.');
        }
        
    } catch (err) {
        console.error("Connection Error:", err);
        alert('SERVER NOT CONNECTED. Check if node server.js is running on port 3000');
    }
});












script.js
const paymentForm = document.getElementById('paymentForm');

paymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        amount: document.getElementById('amount').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value
    };

    try {
        const res = await fetch('http://localhost:3000/api/process-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await res.json();

        if (result.success && result.payuParams) {
            const payuForm = document.createElement('form');
            payuForm.action = result.payuUrl;
            payuForm.method = 'POST';

            for (const key in result.payuParams) {
                if (result.payuParams.hasOwnProperty(key)) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = result.payuParams[key];
                    payuForm.appendChild(input);
                }
            }

            document.body.appendChild(payuForm);
            payuForm.submit();
        } else {
            alert('Payment initialization failed.');
        }
        
    } catch (err) {
        console.error(err);
        alert('SERVER NOT CONNECTED');
    }
});









const express = require('express');
const cors = require('cors');
const { initiatePayUPayment } = require('./.api/payu');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/process-payment', (req, res) => {
    const userData = req.body;
    const payuData = initiatePayUPayment(userData);

    console.log("Processing payment for:", userData.firstName);

    res.json({
        success: true,
        ...payuData
    });
});

app.post('/payment/success', (req, res) => {
    console.log("Payment Successful!");
    res.send("<h1>Payment Successful!</h1>");
});

app.post('/payment/failure', (req, res) => {
    console.log("Payment Failed!");
    res.send("<h1>Payment Failed!</h1>");
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});




