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
    const addPOBtn = document.getElementById("addPOBtn");
    const purchaseOrderList = document.getElementById("purchaseOrderList");
    const purchaseOrderForm = document.getElementById("purchaseOrderForm");
    const purchaseOrderFormContainer = document.getElementById("purchaseOrderFormContainer");
    const itemsTable = document.getElementById("itemsTable").querySelector("tbody");
    const addItem = document.getElementById("addItem");
    const attachmentsInput = document.getElementById("attachments");
    const attachmentList = document.getElementById("attachmentList");
    const cancelPurchaseOrder = document.getElementById("cancelPurchaseOrder");
    const addVendorBtn = document.querySelector(".add-icon");
    const deleteVendorBtn = document.querySelector(".delete-icon");
    const vendorSelect = document.getElementById("editVendor");

    let purchaseOrders = []; // Store all POs and their data
    let editingPOIndex = null; // Track the currently edited PO

    // Initialize the form with one row
    const initializeItemsTable = () => {
        itemsTable.innerHTML = ""; // Clear the table
        addItemRow(); // Add a default row
    };

    // Add Item Row
    const addItemRow = (item = { description: "", quantity: 1, rate: 0, tax: 0 }) => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td><input type="text" placeholder="Item description" value="${item.description}" required /></td>
            <td><input type="number" min="1" placeholder="Quantity" class="item-quantity" value="${item.quantity}" required /></td>
            <td><input type="number" min="0.01" step="0.01" placeholder="Rate" class="item-rate" value="${item.rate}" required /></td>
            <td><input type="number" min="0" step="0.01" placeholder="Tax (%)" class="item-tax" value="${item.tax}" required /></td>
            <td class="total-cell">$0.00</td>
            <td><button type="button" class="delete-item-btn" style="color: red;">X</button></td>
        `;
        itemsTable.appendChild(newRow);

        const quantityInput = newRow.querySelector(".item-quantity");
        const rateInput = newRow.querySelector(".item-rate");
        const taxInput = newRow.querySelector(".item-tax");
        const totalCell = newRow.querySelector(".total-cell");
        const deleteBtn = newRow.querySelector(".delete-item-btn");

        const calculateRowTotal = () => {
            const quantity = parseFloat(quantityInput.value) || 0;
            const rate = parseFloat(rateInput.value) || 0;
            const taxPercent = parseFloat(taxInput.value) || 0;
            const subtotal = quantity * rate;
            const total = subtotal + (subtotal * taxPercent) / 100;
            totalCell.textContent = `$${total.toFixed(2)}`;
        };

        quantityInput.addEventListener("input", calculateRowTotal);
        rateInput.addEventListener("input", calculateRowTotal);
        taxInput.addEventListener("input", calculateRowTotal);

        deleteBtn.addEventListener("click", () => {
            newRow.remove();
        });

        calculateRowTotal(); // Initial calculation
    };

    // Ensure Add Item Button Works
    addItem.addEventListener("click", () => {
        addItemRow(); // Add a new row
    });

    // Handle Attachments
    attachmentsInput.addEventListener("change", () => {
        Array.from(attachmentsInput.files).forEach((file) => {
            const listItem = document.createElement("div");
            listItem.classList.add("attachment-item");

            const fileLink = document.createElement("a");
            fileLink.href = URL.createObjectURL(file);
            fileLink.target = "_blank";
            fileLink.textContent = file.name;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "X";
            deleteBtn.style.color = "red";
            deleteBtn.classList.add("delete-attachment-btn");

            deleteBtn.addEventListener("click", () => {
                listItem.remove();
            });

            listItem.appendChild(fileLink);
            listItem.appendChild(deleteBtn);
            attachmentList.appendChild(listItem);
        });

        // Clear input to allow adding the same file again
        attachmentsInput.value = "";
    });

    // Show form and temporarily hide PO cards
    addPOBtn.addEventListener("click", () => {
        purchaseOrderFormContainer.classList.remove("hidden"); // Show the form
        purchaseOrderList.classList.add("hidden"); // Hide the list
        addPOBtn.style.display = "none"; // Hide the "Add Purchase Order" button
        purchaseOrderForm.reset(); // Reset the form
        initializeItemsTable(); // Initialize the items table
        attachmentList.innerHTML = ""; // Clear attachments
        editingPOIndex = null; // Reset editing state
    });

    // Cancel button functionality
    cancelPurchaseOrder.addEventListener("click", () => {
        purchaseOrderForm.reset();
        purchaseOrderFormContainer.classList.add("hidden");
        purchaseOrderList.classList.remove("hidden");
        addPOBtn.style.display = "block"; // Show the "Add Purchase Order" button
    });

    // Save Purchase Order
    purchaseOrderForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const poNumber = document.getElementById("poNumber").value.trim();
        const poDate = document.getElementById("poDate").value;
        if (!poNumber || !poDate) {
            alert("PO Number and Date are required.");
            return;
        }

        const vendor = vendorSelect.value || "N/A";
        const items = Array.from(itemsTable.children).map((row) => {
            return {
                description: row.querySelector("td:first-child input").value,
                quantity: parseFloat(row.querySelector(".item-quantity").value) || 0,
                rate: parseFloat(row.querySelector(".item-rate").value) || 0,
                tax: parseFloat(row.querySelector(".item-tax").value) || 0,
                total: row.querySelector(".total-cell").textContent,
            };
        });

        const attachments = Array.from(attachmentList.children).map((child) => {
            return child.querySelector("a").textContent;
        });

        const poData = {
            poNumber,
            poDate,
            vendor,
            items,
            attachments,
        };

        if (editingPOIndex !== null) {
            purchaseOrders[editingPOIndex] = poData;
        } else {
            purchaseOrders.push(poData);
        }

        renderPOCards();

        purchaseOrderForm.reset();
        purchaseOrderFormContainer.classList.add("hidden");
        purchaseOrderList.classList.remove("hidden");
        addPOBtn.style.display = "block";
    });

    // Render PO Cards
    const renderPOCards = () => {
        purchaseOrderList.innerHTML = "";
        purchaseOrders.forEach((po, index) => {
            const card = document.createElement("div");
            card.classList.add("po-card");
            card.innerHTML = `
                <div><strong>PO #${po.poNumber}</strong></div>
                <div>Date: ${po.poDate}</div>
                <div>Vendor: ${po.vendor}</div>
            `;
            card.addEventListener("click", () => {
                loadPOData(index);
            });
            purchaseOrderList.appendChild(card);
        });
    };

    // Load PO Data into Form
    const loadPOData = (index) => {
        const poData = purchaseOrders[index];
        editingPOIndex = index;

        document.getElementById("poNumber").value = poData.poNumber;
        document.getElementById("poDate").value = poData.poDate;
        vendorSelect.value = poData.vendor;

        itemsTable.innerHTML = "";
        poData.items.forEach(addItemRow);

        attachmentList.innerHTML = "";
        poData.attachments.forEach((fileName) => {
            const listItem = document.createElement("div");
            const fileLink = document.createElement("a");
            fileLink.href = "#";
            fileLink.textContent = fileName;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "X";
            deleteBtn.style.color = "red";

            deleteBtn.addEventListener("click", () => {
                listItem.remove();
            });

            listItem.appendChild(fileLink);
            listItem.appendChild(deleteBtn);
            attachmentList.appendChild(listItem);
        });

        purchaseOrderFormContainer.classList.remove("hidden");
        purchaseOrderList.classList.add("hidden");
        addPOBtn.style.display = "none";
    };

    // Add Vendor
    addVendorBtn.addEventListener("click", () => {
        const newVendor = prompt("Enter new vendor name:");
        if (newVendor) {
            const option = document.createElement("option");
            option.value = newVendor;
            option.textContent = newVendor;
            vendorSelect.appendChild(option);
        }
    });

    // Delete Vendor
    deleteVendorBtn.addEventListener("click", () => {
        if (vendorSelect.selectedIndex > 0) {
            vendorSelect.remove(vendorSelect.selectedIndex);
        }
    });

    initializeItemsTable(); // Add default item row on load
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

    // Reset stock structure when location changes
    const resetStockStructure = () => {
        if (confirm("Do you want to save changes before switching location?")) {
            saveChangesToDatabase(); // Ensure changes are saved before reset
        }
        aisleContainer.innerHTML = ""; // Clear aisles
        binStocks = {}; // Reset bin stocks
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
        aisle.dataset.aisle = `Aisle ${aisleCount}`;
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
        rack.dataset.rack = `Rack ${rackCount}`;
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
        shelf.dataset.shelf = `Shelf ${shelfCount}`;
        rack.appendChild(shelf);
    };

    // Add Bin
    window.addBin = (shelfElement) => {
        const shelf = shelfElement.parentNode;
        const binCount = shelf.querySelectorAll(".bin").length + 1;
        const bin = document.createElement("div");
        bin.className = "bin";
        const binId = `${shelf.closest(".aisle").dataset.aisle}-${shelf.closest(".rack").dataset.rack}-${shelf.dataset.shelf}-BIN${binCount}`;
        bin.dataset.bin = binId;
        bin.dataset.aisle = shelf.closest(".aisle").dataset.aisle;
        bin.dataset.rack = shelf.closest(".rack").dataset.rack;
        bin.dataset.shelf = shelf.dataset.shelf;
        bin.textContent = `BIN ${binCount}`;
        shelf.appendChild(bin);

        // Add click event to select bin
        bin.addEventListener("click", () => selectBin(bin));
    };

    const selectBin = (bin) => {
        if (selectedBin) {
            selectedBin.classList.remove("selected");
        }
        selectedBin = bin;
        selectedBin.classList.add("selected");
    
        const binId = bin.dataset.bin;
        const stock = binStocks[binId] || 0;
    
        // Concise details without repetition
        const binLocation = `${bin.dataset.aisle}, ${bin.dataset.rack}, ${bin.dataset.shelf}`;
        binDetails.value = `Location: ${binLocation}\nBin: ${binId}\nStock: ${stock}`;
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
    
        const binId = selectedBin.dataset.bin;
        binStocks[binId] = (binStocks[binId] || 0) + quantity;
    
        // Concise details without repetition
        const binLocation = `${selectedBin.dataset.aisle}, ${selectedBin.dataset.rack}, ${selectedBin.dataset.shelf}`;
        binDetails.value = `Location: ${binLocation}\nBin: ${binId}\nStock: ${binStocks[binId]}`;
        binStockQuantity.value = ""; // Clear input
    });
    
    
    // Save Stock Changes
    saveStockChangesBtn.addEventListener("click", () => {
        saveChangesToDatabase();
        alert("Stock changes saved successfully!");
    });
    
    // Save changes to Firebase (placeholder function)
    const saveChangesToDatabase = () => {
        console.log("Saving to Firebase:", binStocks);
        // Add Firebase save logic here
    };
    
    // Delete Element
    window.deleteElement = (button, type) => {
        const element = button.parentNode;
        if (confirm(`Are you sure you want to delete this ${type}?`)) {
            element.remove();
        }
    };
    
});
