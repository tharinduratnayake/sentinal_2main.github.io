document.addEventListener("DOMContentLoaded", () => {
    const categoriesContainer = document.getElementById("categories");
    const formsContainer = document.getElementById("forms-container");

    // Fetch JSON Data
    fetch("another.json")
        .then(response => response.json())
        .then(data => {
            renderCategories(data.categories);
        })
        .catch(error => console.error("Error fetching data:", error));

    // Render Categories as Radio Buttons
    function renderCategories(categories) {
        const categoriesContainer = document.getElementById("categories");
    
        for (const [category, data] of Object.entries(categories)) {
            // Create a wrapper for each category
            const wrapper = document.createElement("div");
            wrapper.className = "category-wrapper";
            wrapper.style.marginBottom = "20px";
    
            // Add radio button
            const label = document.createElement("label");
            label.innerHTML = `
                <input type="radio" name="category" value="${category}"> ${category}
            `;
            wrapper.appendChild(label);
    
            // Add images below the radio button
            if (data.images && data.images.length === 2) {
                const img1 = document.createElement("img");
                img1.src = data.images[0];
                img1.alt = `${category} Image 1`;
                img1.style.width = "100px";
                img1.style.marginRight = "10px";
    
                const img2 = document.createElement("img");
                img2.src = data.images[1];
                img2.alt = `${category} Image 2`;
                img2.style.width = "100px";
    
                const imgContainer = document.createElement("div");
                imgContainer.style.marginTop = "10px";
                imgContainer.appendChild(img1);
                imgContainer.appendChild(img2);
    
                wrapper.appendChild(imgContainer);
            }
    
            // Add event listener to render form when selected
            label.addEventListener("change", () => {
                renderForm(category, data.medicines);
            });
    
            categoriesContainer.appendChild(wrapper);
        }
    }
    

    // Render Form for Selected Category
    function renderForm(category, medicines) {
        formsContainer.innerHTML = ""; // Clear previous forms
        const form = document.createElement("form");
        form.id = `${category}-form`;
        medicines.forEach(med => {
            const field = document.createElement("div");
            field.innerHTML = `
                <label>
                    ${med.name} <br>
                    <input type="number" id="${med.id}" min="${med.min}" placeholder="${med.placeholder}">
                </label>
            `;
            form.appendChild(field);
        });

        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.textContent = "Add to Table";
        addButton.addEventListener("click", () => addToTable(category, medicines));
        form.appendChild(addButton);

        formsContainer.appendChild(form);
    }

    // Add Medicines to Summary Table
    function addToTable(category, medicines) {
        const tableBody = document.getElementById("tbl").querySelector("tbody");

        medicines.forEach(med => {
            const qty = parseInt(document.getElementById(med.id)?.value || "0");
            if (qty > 0) {
                const existingRow = Array.from(tableBody.rows).find(row => row.cells[0].innerText === med.name);

                if (existingRow) {
                    // Update Existing Row
                    existingRow.cells[1].innerText = qty;
                    existingRow.cells[3].innerText = qty * parseFloat(med.placeholder.match(/\d+/)[0]);
                } else {
                    // Add New Row
                    const row = tableBody.insertRow();
                    row.insertCell(0).innerText = med.name;
                    row.insertCell(1).innerText = qty;
                    row.insertCell(2).innerText = med.placeholder;
                    row.insertCell(3).innerText = qty * parseFloat(med.placeholder.match(/\d+/)[0]);
                    const actionCell = row.insertCell(4);
                    const clearButton = document.createElement("button");
                    clearButton.textContent = "Clear";
                    clearButton.addEventListener("click", () => {
                        tableBody.removeChild(row);
                        updateGrandTotal();
                    });
                    actionCell.appendChild(clearButton);
                }
            }
        });
        updateGrandTotal();
    }
});

// Add Event Listeners for Favorites Buttons
document.getElementById("add-favorites").addEventListener("click", addToFavorites);
document.getElementById("apply-favorites").addEventListener("click", applyFavorites);

// Function to Add Current Table Content to Favorites
function addToFavorites() {
    const tableBody = document.getElementById("tbl").querySelector("tbody");
    const favorites = [];

    Array.from(tableBody.rows).forEach(row => {
        const name = row.cells[0].innerText;
        const quantity = parseInt(row.cells[1].innerText);
        const price = parseFloat(row.cells[2].innerText.match(/\d+/)[0]); // Extract numeric price
        const total = parseFloat(row.cells[3].innerText);

        favorites.push({ name, quantity, price, total });
    });

    if (favorites.length > 0) {
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert("Favorites saved successfully!");
    } else {
        alert("No items to save as favorites!");
    }
}

// Function to Apply Favorites to the Table
function applyFavorites() {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites"));

    if (storedFavorites && storedFavorites.length > 0) {
        const tableBody = document.getElementById("tbl").querySelector("tbody");

        storedFavorites.forEach(fav => {
            const existingRow = Array.from(tableBody.rows).find(row => row.cells[0].innerText === fav.name);

            if (existingRow) {
                // Update Existing Row
                existingRow.cells[1].innerText = fav.quantity;
                existingRow.cells[3].innerText = fav.total;
            } else {
                // Add New Row
                const row = tableBody.insertRow();
                row.insertCell(0).innerText = fav.name;
                row.insertCell(1).innerText = fav.quantity;
                row.insertCell(2).innerText = `Unit price: Rs. ${fav.price}`;
                row.insertCell(3).innerText = fav.total;

                // Add Clear Button
                const actionCell = row.insertCell(4);
                const clearButton = document.createElement("button");
                clearButton.textContent = "Clear";
                clearButton.addEventListener("click", () => {
                    tableBody.removeChild(row);
                    updateGrandTotal();
                });
                actionCell.appendChild(clearButton);
            }
        });

        updateGrandTotal();
        alert("Favorites applied successfully!");
    } else {
        alert("No favorites saved!");
    }
}


// Event Listener for Clear All Button
document.getElementById("clear-table").addEventListener("click", clearTable);

// Function to Clear All Data from the Table
function clearTable() {
    const tableBody = document.getElementById("tbl").querySelector("tbody");
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
    updateGrandTotal(); // Reset the total
}



// Function to Calculate and Update Grand Total
function updateGrandTotal() {
    const tableBody = document.getElementById("tbl").querySelector("tbody");
    let grandTotal = 0;

    // Loop through each row and add the total column value
    Array.from(tableBody.rows).forEach(row => {
        const totalCell = row.cells[3];
        if (totalCell) {
            grandTotal += parseFloat(totalCell.innerText) || 0;
        }
    });

    // Update the Grand Total Display
    document.getElementById("grand-total").innerText = `Grand Total: Rs. ${grandTotal.toFixed(2)}`;
}

document.getElementById("buy-now-button").addEventListener("click", () => {
    const tableBody = document.getElementById("tbl").querySelector("tbody");

    if (tableBody.rows.length === 0) {
        alert("Please add medicines to the table before proceeding to checkout!");
    } else {
        // Collect the table data to pass to the checkout page (optional)
        const tableData = Array.from(tableBody.rows).map(row => ({
            name: row.cells[0].innerText,
            quantity: row.cells[1].innerText,
            unitPrice: row.cells[2].innerText,
            totalPrice: row.cells[3].innerText
        }));

        // Store the table data in localStorage (optional for checkout.html)
        localStorage.setItem("cartData", JSON.stringify(tableData));

        // Navigate to the checkout page
        window.location.href = "checkout.html";
    }
});


