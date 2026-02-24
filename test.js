const fs = require('fs');
const data = {
    client: { type: "Fisica", name: "Jane", documentType: "Pasaporte", documentNumber: "123", nationality: "ES", address: "Madrid" },
    property: { project: "Larimar", unitNumber: "A1", level: "1", squareMeters: 50, rooms: 1, bathrooms: 1 },
    paymentPlan: { currency: "USD", totalPrice: 100000, reservationAmount: 0, downPaymentAmount: 0, deliveryAmount: 0, isCash: true },
    clauses: { pago_anticipado: false, golf_membership: false }
};

fetch("http://localhost:3000/api/contracts/generate/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
}).then(async r => {
    if (!r.ok) {
        const text = await r.text();
        fs.writeFileSync('err.txt', "STATUS: " + r.status + "\nBODY: " + text, 'utf8');
        console.log("Error written to err.txt");
    } else {
        console.log("Success!");
    }
}).catch(console.error);
