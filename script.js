const paymentForm = document.getElementById("paymentForm");

paymentForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Page reload hone se rokta hai

    // HTML elements se values fetch karna
    const cardnumber = document.getElementById("cc-number").value;
    const cvvnumber = document.getElementById("CVC-number").value;
    const amount = document.getElementById("amount-number").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const formData = {
        amount: amount,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        cardnumber: cardnumber,
        cvvnumber: cvvnumber
    };

    try {
        const res = await fetch('http://localhost:3000/payment', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            console.log("Data successfully sent to server!"); 
            paymentForm.reset(); // Clear form fields, no alert popup!
        } else {
            console.error("Server error while saving data.");
        }

    } catch (err) {
        console.error("Connection Error:", err);
    }
});
