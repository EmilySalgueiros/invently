//Can Erase not being used as of 11/17/24
// Initialize an empty array to store the inventory data
let inventory = [];

// Function to fetch the inventory from the server asynchronously
async function fetchInventory() {
    // Fetch inventory data from the API endpoint
    const response = await fetch('/api/inventory');
    // Parse the response as JSON
    const data = await response.json();
    // Update the inventory array with the fetched data
    inventory = data;
    // Display the updated inventory on the page
    displayInventory();
}

// Function to add a new item to the inventory
async function addItem() {
    // Get the item name and quantity from the input fields
    const itemName = document.getElementById("itemName").value;
    const itemQuantity = document.getElementById("itemQuantity").value;

    // Check if both fields are filled in
    if (itemName && itemQuantity) {
        // Create an object representing the new item
        const item = {
            name: itemName,
            quantity: itemQuantity
        };
        
        // Send a POST request to the server to add the new item to the inventory
        await fetch('/api/inventory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Convert the item object to a JSON string and send it in the request body
            body: JSON.stringify(item)
        });

        // Fetch the updated inventory from the server
        fetchInventory();
        // Clear the input form after adding the item
        clearForm();
    } else {
        // Show an alert if one or both fields are empty
        alert("Please fill in both fields.");
    }
}

// Function to delete an item from the inventory
async function deleteItem(index) {
    // Send a DELETE request to the server to remove the item by its index
    await fetch(`/api/inventory/${index}`, {
        method: 'DELETE'
    });
    // Fetch the updated inventory from the server
    fetchInventory();
}

// Function to display the inventory on the page
function displayInventory() {
    // Get the inventory list element from the DOM
    const inventoryList = document.getElementById("inventoryList");
    // Clear the existing list
    inventoryList.innerHTML = "";

    // Loop through each item in the inventory
    inventory.forEach((item, index) => {
        // Create a new list item element for each inventory item
        const li = document.createElement("li");
        // Set the inner HTML of the list item to display the item name and quantity, and a delete button
        li.innerHTML = `${item.name} - Quantity: ${item.quantity} 
                        <button onclick="deleteItem(${index})">Delete</button>`;
        // Add the list item to the inventory list
        inventoryList.appendChild(li);
    });
}

// Function to clear the input form
function clearForm() {
    // Clear the item name and quantity input fields
    document.getElementById("itemName").value = "";
    document.getElementById("itemQuantity").value = "";
}

// Initial fetch of the inventory when the page loads
fetchInventory();
