document.addEventListener("DOMContentLoaded", () => {
    const addProductBtn = document.getElementById("addProductBtn");
    const inventoryTable = document.getElementById("inventoryTable").querySelector("tbody");
    const editInventoryModal = document.getElementById("editInventoryModal");
    const closeEditModal = document.getElementById("closeEditModal");
    const editInventoryForm = document.getElementById("editInventoryForm");
    const addLocationBtn = document.getElementById("addLocationBtn");
    const editLocation = document.getElementById("editLocation");

    // Add Product Button
    addProductBtn.addEventListener("click", () => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>001</td>
            <td>SKU001</td>
            <td><a href="#" class="edit-link">New Item</a></td>
            <td>10</td>
            <td>5</td>
            <td class="status-cell">In Stock</td>
            <td>A01</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;
        inventoryTable.appendChild(newRow);
        updateRowStatus(newRow);
    });
 // Edit Button
 inventoryTable.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn") || e.target.classList.contains("edit-link")) {
        const row = e.target.closest("tr");
        const [itemCode, sku, description, quantity, threshold, , location] = row.children;

        // Prefill Edit Form
        document.getElementById("editItemCode").value = itemCode.textContent;
        document.getElementById("editSKU").value = sku.textContent;
        document.getElementById("editDescription").value = description.textContent;
        document.getElementById("editQuantity").value = quantity.textContent;
        document.getElementById("editThreshold").value = threshold.textContent;
        document.getElementById("editLocation").value = location.textContent;

        // Show Modal
        editInventoryModal.classList.add("active");
    }
});

// Save Changes
editInventoryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const itemCode = document.getElementById("editItemCode").value;
    const rows = Array.from(inventoryTable.children);
    const row = rows.find((row) => row.children[0].textContent === itemCode);

    if (row) {
        const [itemCodeCell, skuCell, descCell, qtyCell, thresholdCell, statusCell, locationCell] = row.children;

        skuCell.textContent = document.getElementById("editSKU").value;
        descCell.textContent = document.getElementById("editDescription").value;
        qtyCell.textContent = document.getElementById("editQuantity").value;
        thresholdCell.textContent = document.getElementById("editThreshold").value;
        locationCell.textContent = document.getElementById("editLocation").value;

        updateRowStatus(row);
    }

    editInventoryModal.classList.remove("active");
});

// Add Location
addLocationBtn.addEventListener("click", () => {
    const newLocation = prompt("Enter new location:");
    if (newLocation) {
        const option = document.createElement("option");
        option.value = newLocation;
        option.textContent = newLocation;
        editLocation.appendChild(option);
    }
});

// Close Modal
closeEditModal.addEventListener("click", () => {
    editInventoryModal.classList.remove("active");
});

// Update Status Cell
function updateRowStatus(row) {
    const quantity = parseInt(row.children[3].textContent, 10);
    const threshold = parseInt(row.children[4].textContent, 10);
    const statusCell = row.children[5];

    if (quantity <= threshold) {
        statusCell.textContent = "Low Stock";
        statusCell.style.backgroundColor = "red";
        statusCell.style.color = "white";
    } else {
        statusCell.textContent = "In Stock";
        statusCell.style.backgroundColor = "green";
        statusCell.style.color = "white";
    }
}
});