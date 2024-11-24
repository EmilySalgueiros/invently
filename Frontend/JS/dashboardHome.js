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
        let newSKU = generateUniqueSKU();
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}</td>
            <td>${newSKU}</td>
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

    // Delete Button Functionality
    inventoryTable.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            // Find the parent row and remove it
            const rowToDelete = e.target.closest("tr");
            if (rowToDelete) {
                rowToDelete.remove();
            }
        }
    });


    // Generate a unique SKU
    function generateUniqueSKU() {
        let existingSKUs = Array.from(inventoryTable.querySelectorAll("td:nth-child(2)")).map(
            (cell) => cell.textContent
        );
        let newSKU;
        do {
            newSKU = `SKU${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
        } while (existingSKUs.includes(newSKU));
        return newSKU;
    }



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

document.addEventListener("DOMContentLoaded", () => {
    // Tab Switching
    const setupTabSwitching = () => {
        const tabs = document.querySelectorAll(".tab");
        const tabContents = document.querySelectorAll(".tab-content");

        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                // Remove active class from all tabs and contents
                tabs.forEach((t) => t.classList.remove("active"));
                tabContents.forEach((content) => content.classList.remove("active"));

                // Add active class to the clicked tab and corresponding content
                tab.classList.add("active");
                const target = tab.getAttribute("data-tab");
                document.getElementById(tab.getAttribute("data-tab")).classList.add("active");
            });
        });
    };

    // Add/Remove Options for Vendor, Category, and Location
    const setupAddRemoveOptions = () => {
        const addButtons = document.querySelectorAll(".add-icon");
        const deleteButtons = document.querySelectorAll(".delete-icon");

        addButtons.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const inputType = btn.previousElementSibling.id;
                const newValue = prompt(`Enter a new ${inputType.replace("edit", "")}:`);
                if (newValue) {
                    const select = document.getElementById(inputType);
                    const option = document.createElement("option");
                    option.value = newValue;
                    option.textContent = newValue;
                    select.appendChild(option);
                }
            });
        });

        deleteButtons.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const select = btn.previousElementSibling.previousElementSibling;
                const selectedOption = select.selectedOptions[0];
                if (selectedOption) {
                    const confirmed = confirm(`Are you sure you want to delete "${selectedOption.text}"?`);
                    if (confirmed) {
                        selectedOption.remove();
                    }
                }
            });
        });
    };

    // Preset Color Selection
    const setupColorSelection = () => {
        const colorButtons = document.querySelectorAll(".color-btn");

        colorButtons.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault(); // Prevent any default behavior
                e.stopPropagation(); // Stop the event from bubbling up

                const selectedColor = btn.getAttribute("data-color");

                // Highlight the selected button
                colorButtons.forEach((b) => b.classList.remove("selected")); // Remove selection from others
                btn.classList.add("selected"); // Add selection to clicked button

                // Update any visual element within the modal
                const selectedColorDisplay = document.getElementById("selectedColorDisplay");
                if (selectedColorDisplay) {
                    selectedColorDisplay.style.backgroundColor = selectedColor;
                    selectedColorDisplay.textContent = selectedColor; // Optional: Show the color value
                }
            });
        });
    };


    // Exit Modal Functionality
    const setupExitModal = () => {
        const exitModalButton = document.getElementById("exitModal");
        const editInventoryModal = document.getElementById("editInventoryModal");

        exitModalButton.addEventListener("click", () => {
            editInventoryModal.classList.remove("active"); // Hide modal when clicked
        });
    };

    // Initialize All Features
    setupTabSwitching();
    setupAddRemoveOptions();
    setupColorSelection();
    setupExitModal();
});

document.addEventListener("DOMContentLoaded", () => {
    const aisleContainer = document.getElementById("aisleContainer");
    const addAisleBtn = document.getElementById("addAisleBtn");
    const binDetails = document.getElementById("binDetails");
    const addStockToBinBtn = document.getElementById("addStockToBinBtn");
    const binStockQuantity = document.getElementById("binStockQuantity");
    const saveStockChangesBtn = document.getElementById("saveStockChangesBtn");
    const locationSelect = document.getElementById("editLocation");

    let selectedBin = null;
    let binStocks = {}; // Store stock data for bins

    // Function to reset stock structure when location changes
    const resetStockStructure = () => {
        if (confirm("Do you want to save changes before switching location?")) {
            alert("Changes saved successfully!");
        }
        aisleContainer.innerHTML = ""; // Clear aisles
    };

    // Add Aisle
    addAisleBtn.addEventListener("click", () => {
        const aisleCount = aisleContainer.querySelectorAll(".aisle").length + 1;
        const aisle = document.createElement("div");
        aisle.className = "aisle";
        aisle.innerHTML = `
            <h4>Aisle ${aisleCount}</h4>
            <button class="btn-add" onclick="addRack(this)">+ Rack</button>
            <button class="btn-delete" onclick="deleteElement(this, 'aisle')">- Aisle</button>
        `;
        aisleContainer.appendChild(aisle);
    });

    // Add Rack
    window.addRack = (aisleElement) => {
        const aisle = aisleElement.parentNode;
        const rackCount = aisle.querySelectorAll(".rack").length + 1;
        const rack = document.createElement("div");
        rack.className = "rack";
        rack.innerHTML = `
            <h5>Rack ${rackCount}</h5>
            <button class="btn-add" onclick="addShelf(this)">+ Shelf</button>
            <button class="btn-delete" onclick="deleteElement(this, 'rack')">- Rack</button>
        `;
        aisle.appendChild(rack);
    };

    // Add Shelf
    window.addShelf = (rackElement) => {
        const rack = rackElement.parentNode;
        const shelfCount = rack.querySelectorAll(".shelf").length + 1;
        const shelf = document.createElement("div");
        shelf.className = "shelf";
        shelf.innerHTML = `
            <h6>Shelf ${shelfCount}</h6>
            <button class="btn-add" onclick="addBin(this)">+ Bin</button>
            <button class="btn-delete" onclick="deleteElement(this, 'shelf')">- Shelf</button>
        `;
        rack.appendChild(shelf);
    };

    // Add Bin
    window.addBin = (shelfElement) => {
        const shelf = shelfElement.parentNode;
        const binCount = shelf.querySelectorAll(".bin").length + 1;
        const bin = document.createElement("div");
        bin.className = "bin";
        bin.dataset.bin = `BIN ${binCount}`;
        bin.textContent = `BIN ${binCount}`;
        shelf.appendChild(bin);

        // Add click event to select bin
        bin.addEventListener("click", () => selectBin(bin));
    };

    // Select Bin
    const selectBin = (bin) => {
        if (selectedBin) {
            selectedBin.classList.remove("selected");
        }
        selectedBin = bin;
        selectedBin.classList.add("selected");

        const binLabel = bin.dataset.bin;
        const stock = binStocks[binLabel] || 0;

        binDetails.value = `Bin: ${binLabel}\nStock: ${stock}`;
    };

    // Add Stock to Selected Bin
    addStockToBinBtn.addEventListener("click", () => {
        if (!selectedBin) {
            alert("Please select a bin.");
            return;
        }

        const quantity = parseInt(binStockQuantity.value, 10);
        if (!quantity || quantity <= 0) {
            alert("Please enter a valid quantity.");
            return;
        }

        const binLabel = selectedBin.dataset.bin;
        binStocks[binLabel] = (binStocks[binLabel] || 0) + quantity;

        binDetails.value = `Bin: ${binLabel}\nStock: ${binStocks[binLabel]}`;
        binStockQuantity.value = ""; // Clear input
    });

    // Save Stock Changes
    saveStockChangesBtn.addEventListener("click", () => {
        alert("Stock changes saved successfully!");
    });

    // Change Location
    locationSelect.addEventListener("change", resetStockStructure);

    // Delete Element
    window.deleteElement = (button, type) => {
        const element = button.parentNode;
        if (confirm(`Are you sure you want to delete this ${type}?`)) {
            element.remove();
        }
    };
});
