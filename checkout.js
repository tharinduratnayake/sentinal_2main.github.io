document.addEventListener("DOMContentLoaded", () => {
    const checkoutTable = document.getElementById("checkoutTable").querySelector("tbody");
    const grandTotalDisplay = document.getElementById("grand-total");

    // Retrieve cart data from localStorage
    const cartData = JSON.parse(localStorage.getItem("cartData"));

    if (cartData && cartData.length > 0) {
        let grandTotal = 0;

        // Populate the table with the cart data
        cartData.forEach(item => {
            const row = checkoutTable.insertRow();
            row.insertCell(0).innerText = item.name;
            row.insertCell(1).innerText = item.quantity;
            row.insertCell(2).innerText = item.unitPrice;
            row.insertCell(3).innerText = item.totalPrice;

            // Calculate the grand total
            grandTotal += parseFloat(item.totalPrice);
        });

        // Update the grand total display
        grandTotalDisplay.innerText = `Grand Total: Rs. ${grandTotal.toFixed(2)}`;
    } else {
        // Display a message if the cart is empty
        checkoutTable.innerHTML = `
            <tr>
                <td colspan="4">No medicines added to the cart. Please go back and add items.</td>
            </tr>
        `;
    }

    // Event listener for the Confirm Purchase button
    document.getElementById("confirm-button").addEventListener("click", () => {
        if (cartData && cartData.length > 0) {
            alert("Thank you for your purchase! Your order has been confirmed.");
            localStorage.removeItem("cartData"); // Clear the cart after purchase
            window.location.href = "pharmacy.html"; // Redirect to the pharmacy page
        } else {
            alert("Your cart is empty. Please add medicines before confirming your purchase.");
        }
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("detailsForm");
    const deliveryDetails = document.getElementById("delivery-details");
    const cardDetails = document.getElementById("card-details");
    const finalMessage = document.getElementById("final");

    const deliveryMethods = document.querySelectorAll('input[name="deliveryMethod"]');
    deliveryMethods.forEach((radio) => {
        radio.addEventListener("change", () => {
            if (radio.value === "home") {
                deliveryDetails.classList.remove("hidden");
            } else {
                deliveryDetails.classList.add("hidden");
            }
        });
    });

    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethods.forEach((radio) => {
        radio.addEventListener("change", () => {
            if (radio.value === "card") {
                cardDetails.classList.remove("hidden");
            } else {
                cardDetails.classList.add("hidden");
            }
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent default form submission

        const deliveryMethod = form.querySelector('input[name="deliveryMethod"]:checked').value;
        const paymentMethod = form.querySelector('input[name="paymentMethod"]:checked').value;
        let message = "Thank you for your submission!";

        if (deliveryMethod === "home") {
            const deliveryAddress = form.deliveryAddress.value;
            const deliveryDate = form.deliveryDate.value;
            message += ` Your order will be delivered to ${deliveryAddress} on ${deliveryDate}.`;
        } else {
            message += " You can visit the pharmacy to collect your order.";
        }

        finalMessage.innerText = message;
    });
});

