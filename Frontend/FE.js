let inventory = [];

async function fetchInventory() {
    const response = await fetch('/api/inventory');
    const data = await response.json();
    inventory = data;
    displayInventory();
}

async function addItem() {
    const itemName = document.getElementById("itemName").value;
    const itemQuantity = document.getElementById("itemQuantity").value;

    if (itemName && itemQuantity) {
        const item = {
            name: itemName,
            quantity: itemQuantity
        };
        
        await fetch('/api/inventory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });

        fetchInventory();
        clearForm();
    } else {
        alert("Please fill in both fields.");
    }
}

async function deleteItem(index) {
    await fetch(`/api/inventory/${index}`, {
        method: 'DELETE'
    });
    fetchInventory();
}

function displayInventory() {
    const inventoryList = document.getElementById("inventoryList");
    inventoryList.innerHTML = "";

    inventory.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${item.name} - Quantity: ${item.quantity} 
                        <button onclick="deleteItem(${index})">Delete</button>`;
        inventoryList.appendChild(li);
    });
}

function clearForm() {
    document.getElementById("itemName").value = "";
    document.getElementById("itemQuantity").value = "";
}

// Initial fetch
fetchInventory();