//First we start integrating firebase 
// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs, onSnapshot, getDoc, doc, where, addDoc, deleteDoc, updateDoc} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";


// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZstZmYQ2HOdKX639ayM6L_OoGd64ozqs",
    authDomain: "inventlylogin.firebaseapp.com",
    projectId: "inventlylogin",
    storageBucket: "inventlylogin.appspot.com",
    messagingSenderId: "120631227540",
    appId: "1:120631227540:web:526487d0dcbcdd61c63081"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);








//just testing
// Function to populate vendor dropdown in Manage Inventory modal
// This part if for edit and delete button for the table
let editingProductId = null; // Store the ID of the product being edited
const saveProductBtn = document.querySelector('.submit-btn'); // Assuming this is the Save button









// Fetch Inventory Data and Render Table
let maxItemCode = 0; // Keep track of the highest item code

let usedItemCodes = []; // Track all used item codes

//This is to handle category selection

// Handle Category Color Selection
const categoryColorButtons = document.querySelectorAll('.color-btn');

categoryColorButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove selection from other buttons
        categoryColorButtons.forEach(btn => btn.classList.remove('selected'));
        // Highlight the clicked button
        button.classList.add('selected');
        // Store the selected color
        selectedCategoryColor = button.dataset.color;
        console.log(`Selected Color: ${selectedCategoryColor}`);
    });
});

// Update Add Category Function to Include Color
document.getElementById('addCategoryBtn').addEventListener('click', async () => {
    const categoryName = prompt("Enter category name:");
    if (!categoryName) return alert("Category name is required.");

    if (!selectedCategoryColor) {
        return alert("Please select a color for the category.");
    }

    try {
        await addDoc(collection(db, "categories"), {
            name: categoryName,
            color: selectedCategoryColor,
        });
        alert("Category added successfully!");
        fetchCategories(); // Refresh categories
    } catch (error) {
        console.error("Error adding category:", error);
        alert("Failed to add category.");
    }
});



// This is for the categories
const fetchCategories = async () => {
    const categoryDropdown = document.getElementById('editCategory');
    categoryDropdown.innerHTML = '<option value="" disabled selected>Select Category</option>'; // Reset options

    try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        querySnapshot.forEach(doc => {
            const data = doc.data();
            const option = document.createElement('option');
            option.value = data.name;
            option.textContent = data.name;
            option.dataset.color = data.color; // Attach the color as a data attribute
            categoryDropdown.appendChild(option);
        });
        console.log("Categories fetched successfully!");
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
};

// Call fetchCategories when the page loads
fetchCategories();

// addition of categories

const addCategoryBtn = document.getElementById("addCategoryBtn");
addCategoryBtn.addEventListener("click", async () => {
    const newCategory = prompt("Enter a new category:");
    if (!newCategory) return;

    try {
        await addDoc(collection(db, "categories"), { name: newCategory });
        alert("Category added successfully!");
        fetchCategories(); // Refresh categories
    } catch (error) {
        console.error("Error adding category:", error);
        alert("Failed to add category. Please try again.");
    }
});

// delete categories 

const deleteCategoryBtn = document.getElementById("deleteCategoryBtn");
deleteCategoryBtn.addEventListener("click", async () => {
    const categorySelect = document.getElementById("editCategory");
    const selectedCategory = categorySelect.value;

    if (!selectedCategory) {
        alert("Please select a category to delete.");
        return;
    }

    const confirmed = confirm(`Are you sure you want to delete the category "${selectedCategory}"?`);
    if (!confirmed) return;

    try {
        const q = query(collection(db, "categories"), where("name", "==", selectedCategory));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docId = querySnapshot.docs[0].id; // Assuming category names are unique
            await deleteDoc(doc(db, "categories", docId));
            alert("Category deleted successfully!");
            fetchCategories(); // Refresh categories
        } else {
            alert("Category not found in Firestore.");
        }
    } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category. Please try again.");
    }
});










const fetchInventory = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "inventory"));
        inventoryData.length = 0; // Clear existing data
        usedItemCodes = []; // Reset used item codes

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id; // Attach document ID
            inventoryData.push(data);
            // Update maxItemCode
            const itemCode = parseInt(data.itemCode, 10);
            if (!isNaN(itemCode)) {
                usedItemCodes.push(itemCode);
            }
        });
        renderTable(); // Render the updated table
    } catch (error) {
        console.error("Error fetching inventory:", error);
    }
};

//This location will delete the location in firebase
const deleteLocationBtn = document.getElementById("deleteLocationBtn");

deleteLocationBtn.addEventListener("click", async () => {
    const locationSelect = document.getElementById("editLocation");
    const selectedOption = locationSelect.options[locationSelect.selectedIndex];

    if (!selectedOption || !selectedOption.value) {
        alert("Please select a location to delete.");
        return;
    }

    const locationToDelete = selectedOption.value;

    if (confirm(`Are you sure you want to delete the location "${locationToDelete}"?`)) {
        try {
            // Find and delete the location document in Firebase
            const querySnapshot = await getDocs(
                collection(db, "locations")
            );

            let locationDocId = null;

            querySnapshot.forEach((doc) => {
                if (doc.data().name === locationToDelete) {
                    locationDocId = doc.id;
                }
            });

            if (locationDocId) {
                await deleteDoc(doc(db, "locations", locationDocId));
                alert(`Location "${locationToDelete}" deleted successfully!`);
                fetchLocations(); // Refresh dropdown
            } else {
                alert(`Location "${locationToDelete}" not found in Firebase.`);
            }
        } catch (error) {
            console.error("Error deleting location:", error);
            alert("Failed to delete the location. Please try again.");
        }
    }
});




// this function will locate the location added

const fetchLocations = async () => {
    // Select all dropdowns with the 'location-dropdown' class
    const locationDropdowns = document.querySelectorAll(".location-dropdown");

    // Reset all dropdowns
    locationDropdowns.forEach(dropdown => {
        dropdown.innerHTML = '<option value="" disabled selected>Select Location</option>';
    });

    try {
        // Fetch locations from Firebase
        const querySnapshot = await getDocs(collection(db, "locations"));
        querySnapshot.forEach(doc => {
            const locationData = doc.data();
            // Add the location to all dropdowns
            locationDropdowns.forEach(dropdown => {
                const option = document.createElement("option");
                option.value = locationData.name;
                option.textContent = locationData.name;
                dropdown.appendChild(option);
            });
        });

        console.log("Locations fetched and added to all dropdowns.");
    } catch (error) {
        console.error("Error fetching locations:", error);
    }
};





// this is an event listener to addlocation btn:

const addLocationBtn = document.getElementById("addLocationBtn");

addLocationBtn.addEventListener("click", async () => {
    const newLocation = prompt("Enter the new location name:");

    if (newLocation && newLocation.trim() !== "") {
        try {
            await addDoc(collection(db, "locations"), { name: newLocation.trim() });

            alert("Location added successfully!");

            // Refresh the locations in the dropdown
            fetchLocations();
        } catch (error) {
            console.error("Error adding location:", error);
            alert("Failed to add location. Please try again.");
        }
    } else {
        alert("Invalid location name. Please try again.");
    }
});

let selectedLocation = ""; // Store the selected location

document.getElementById("editLocation").addEventListener("change", (event) => {
    selectedLocation = event.target.value; // Update the selected location
    console.log("Selected Location:", selectedLocation);
});



// Add Location to Firebase
const addStockLocationBtn = document.getElementById("addStockLocationBtn");
addStockLocationBtn.addEventListener("click", async () => {
    const newLocation = prompt("Enter the new location name:");

    if (newLocation && newLocation.trim() !== "") {
        try {
            await addDoc(collection(db, "locations"), { name: newLocation.trim() });
            alert("Location added successfully!");
            fetchLocations(); // Refresh the dropdown
        } catch (error) {
            console.error("Error adding location:", error);
            alert("Failed to add location. Please try again.");
        }
    } else {
        alert("Invalid location name. Please try again.");
    }
});

// Delete Location from Firebase
const deleteStockLocationBtn = document.getElementById("deleteStockLocationBtn");
deleteStockLocationBtn.addEventListener("click", async () => {
    const locationSelect = document.getElementById("stockLocation");
    const selectedOption = locationSelect.options[locationSelect.selectedIndex];

    if (!selectedOption || !selectedOption.value) {
        alert("Please select a location to delete.");
        return;
    }

    const locationToDelete = selectedOption.value;

    if (confirm(`Are you sure you want to delete the location "${locationToDelete}"?`)) {
        try {
            const querySnapshot = await getDocs(collection(db, "locations"));

            let locationDocId = null;

            querySnapshot.forEach(doc => {
                if (doc.data().name === locationToDelete) {
                    locationDocId = doc.id;
                }
            });

            if (locationDocId) {
                await deleteDoc(doc(db, "locations", locationDocId));
                alert(`Location "${locationToDelete}" deleted successfully!`);
                fetchLocations(); // Refresh the dropdown
            } else {
                alert(`Location "${locationToDelete}" not found in Firebase.`);
            }
        } catch (error) {
            console.error("Error deleting location:", error);
            alert("Failed to delete the location. Please try again.");
        }
    }
});





//this function calculates the smallest unused item code
const getNextAvailableItemCode = () => {
    let code = 1; // Start from 1
    while (usedItemCodes.includes(code)) {
        code++; // Increment until we find an unused code
    }
    return code;
};



// Handle edit save button


// Reference to the button
const editSaveBtn = document.querySelector(".edit-save-btn");

// Handle Save Edit Changes button
editSaveBtn.addEventListener("click", async () => {
    try {
        // Collect the edited data from the form
        const updatedProduct = {
            itemCode: document.getElementById("editItemCode").value.trim(),
            sku: document.getElementById("editSKU").value.trim(),
            description: document.getElementById("editDescription").value.trim(),
            quantity: parseInt(document.getElementById("editQuantity").value.trim(), 10),
            threshold: parseInt(document.getElementById("editThreshold").value.trim(), 10),
            category: document.getElementById("editCategory").value.trim(),
            location: document.getElementById("editLocation").value.trim(),
            price: parseFloat(document.getElementById("editPrice").value.trim()),
            currency: document.getElementById("editCurrency").value.trim(),
        };

        // Update the product in Firebase
        const productRef = doc(db, "inventory", editingProductId); // `editingProductId` should hold the ID of the product being edited
        await updateDoc(productRef, updatedProduct);

        // Close the modal
        const editModal = document.getElementById("editInventoryModal");
        editModal.style.display = "none";

        // Refresh the table to reflect the changes
        fetchInventory();
        fetchLocations();

        console.log("Product updated successfully.");
    } catch (error) {
        console.error("Error updating product:", error);
        alert("Failed to update the product. Please try again.");
    }
});








// Handle Edit Button Click
const handleEdit = async (e) => {
    const id = e.target.dataset.id; // Get product ID
    const product = inventoryData.find((item) => item.id === id);

    if (product) {
        // Populate modal fields with product details
        document.getElementById("editItemCode").value = product.itemCode;
        document.getElementById("editSKU").value = product.sku;
        document.getElementById("editDescription").value = product.description;
        document.getElementById("editQuantity").value = product.quantity;
        document.getElementById("editThreshold").value = product.threshold;
        document.getElementById("editCategory").value = product.category;
        document.getElementById("editLocation").value = product.location;
        document.getElementById("editPrice").value = product.price;
        document.getElementById("editCurrency").value = product.currency;

        editingProductId = id; // Set editing state

        // Hide "Save Changes" button and show "Save Edit Changes" button
        saveProductBtn.style.display = "none";
        editSaveBtn.style.display = "block";


        editModal.style.display = "flex"; // Show the modal
    } else {
        console.error("Product not found for editing.");
    }
};






// Handle Delete Button Click
const handleDelete = async (e) => {
    const id = e.target.dataset.id;

    console.log(`Attempting to delete document with ID: ${id}`); // Debugging
    const docRef = doc(db, "inventory", id);

    try {
        // Check if the document exists
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            console.error("Document does not exist in Firestore.");
            alert("The product you're trying to delete does not exist.");
            return;
        }

        // Delete the document
        await deleteDoc(docRef);
        alert("Product deleted successfully!");

        //Refreshes table to stay active
        fetchInventory(); // Refresh table

    } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please check console logs for details.");
    }
};

async function populateVendorDropdown() {
    const vendorSelect = document.getElementById("editVendor");
    vendorSelect.innerHTML = '<option value="" disabled selected>Select Vendor</option>'; // Reset options

    try {
        // Fetch vendors from Firebase
        const querySnapshot = await getDocs(collection(db, "vendors"));
        querySnapshot.forEach((doc) => {
            const vendor = doc.data();
            const option = document.createElement("option");
            option.value = doc.id; // Use vendor ID as the value
            option.textContent = `${vendor.companyName} - ${vendor.firstName} ${vendor.lastName}`;
            option.dataset.address = vendor.address || ""; // Store the address in a data attribute
            vendorSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching vendors:", error);
        alert("Failed to load vendors. Please try again.");
    }
}

// Real-time listener for vendor updates
onSnapshot(collection(db, "vendors"), (snapshot) => {
    const vendorSelect = document.getElementById("editVendor");
    vendorSelect.innerHTML = '<option value="" disabled selected>Select Vendor</option>'; // Reset options
    snapshot.forEach((doc) => {
        const vendor = doc.data();
        const option = document.createElement("option");
        option.value = doc.id; // Use vendor ID as the value
        option.textContent = `${vendor.companyName} - ${vendor.firstName} ${vendor.lastName}`;
        option.dataset.address = vendor.address || ""; // Store the address in a data attribute
        vendorSelect.appendChild(option);
    });
});


// Update billing and shipping address when a vendor is selected
// Update billing and shipping address when a vendor is selected
// Update billing, shipping address, and PO number when a vendor is selected
document.getElementById("editVendor").addEventListener("change", async (event) => {
    const selectedVendorId = event.target.value;
    const billingAddressField = document.getElementById("billingAddress");
    const shippingAddressField = document.getElementById("shippingAddress");
    const poNumberField = document.getElementById("poNumber");
    const orderDropdown = document.getElementById("orderDropdown");

    if (!orderDropdown) {
        console.error("Error: orderDropdown element not found.");
        return; // Exit the function if the dropdown does not exist
    }

    try {
        // Fetch the selected vendor's data
        const vendorDoc = await getDoc(doc(db, "vendors", selectedVendorId));
        if (vendorDoc.exists()) {
            const vendor = vendorDoc.data();

            // Update billing and shipping address fields
            const address = vendor.address || "No Address Found";
            billingAddressField.value = address;
            shippingAddressField.value = address;

            // Fetch orders associated with the vendor
            const ordersSnapshot = await getDocs(
                collection(db, "orders"),
                where("vendorId", "==", selectedVendorId)
            );

            if (!ordersSnapshot.empty) {
                const orders = [];
                ordersSnapshot.forEach((doc) => {
                    orders.push(doc.data());
                });

                // Sort orders by date
                orders.sort((a, b) => new Date(b.Date) - new Date(a.Date));

                // Populate the dropdown
                orderDropdown.innerHTML = '<option value="" disabled selected>Select Order</option>';
                orders.forEach((order) => {
                    const option = document.createElement("option");
                    option.value = order["Order#"];
                    option.textContent = `Order#: ${order["Order#"]} | Date: ${order.Date}`;
                    orderDropdown.appendChild(option);
                });

                // Set the default PO number to the latest order
                poNumberField.value = orders[0]["Order#"];
            } else {
                poNumberField.value = "No Orders Found";
                orderDropdown.innerHTML = '<option value="" disabled>No Orders Available</option>';
            }
        } else {
            alert("Vendor not found in Firebase!");
        }
    } catch (error) {
        console.error("Error fetching vendor details or orders:", error);
        alert("Failed to fetch vendor details or orders. Please try again.");
    }
});

document.getElementById("orderDropdown").addEventListener("change", (event) => {
    const selectedOrder = event.target.value;
    document.getElementById("poNumber").value = selectedOrder; // Sync the PO Number with the selected order
});

fetchInventory();
fetchLocations();

//just testing end








// Get modal, open button, and close button
const modal = document.getElementById('addProductModal');
const addProductBtn = document.getElementById('addProductBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

// Open and Close Edit Inventory Modal
const editModal = document.getElementById('editInventoryModal');
const closeEditModal = document.getElementById('exitModal');

// This is for the camera
const video = document.getElementById('video');
const scannerContainer = document.getElementById('scanner-container');
const scanButton = document.getElementById('scanButton');
const stopScanButton = document.getElementById('stopScanBtn');

// Keep track of the media stream
let mediaStream = null;

// Initially hide the scanner container
scannerContainer.style.display = 'none';

// Start the camera when the Scan SKU button is clicked
scanButton.addEventListener('click', async () => {
    try {
        scannerContainer.style.display = 'block'; // Show scanner container
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = mediaStream;
        video.play();
        console.log('Camera started successfully.');
    } catch (err) {
        console.error('Error accessing the camera:', err);
        alert('Unable to access the camera. Please check your permissions.');
    }
});

// Stop the camera when the Stop Scanning button is clicked
stopScanButton.addEventListener('click', () => {
    if (mediaStream) {
        const tracks = mediaStream.getTracks(); // Get all tracks (video/audio)
        tracks.forEach((track) => {
            console.log(`Stopping track: ${track.kind}`); // Debugging: Log each track
            track.stop(); // Stop each track
        });
        mediaStream = null; // Clear the reference to the stream
    }

    // Hide the scanner container and clear the video feed
    scannerContainer.style.display = 'none';
    video.srcObject = null; // Clear the video source object

    console.log('Camera has been completely stopped.');
});



// Function to close the modal
closeEditModal.addEventListener('click', (e) => {
    e.stopPropagation(); // Stop the event from propagating to the document
    editModal.style.display = "none";
    editingProductId = null; // Reset editing state
});

// Tab Switching Logic
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and contents
        tabs.forEach((t) => t.classList.remove('active'));
        tabContents.forEach((content) => content.classList.remove('active'));

        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        document
            .getElementById(tab.getAttribute('data-tab'))
            .classList.add('active');
    });
});

// Close modal if clicking outside of it or on close button
document.addEventListener('click', (e) => {
    if (
        e.target.id === 'closeModalBtn' ||
        e.target.id === 'addProductModal' ||
        e.target === modal
    ) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }
});

// this is to add the itemcode:


// Global variable to track the current item code
let currentItemCode = 1;

// Get references to modal elements
const editItemCodeInput = document.getElementById('editItemCode');





// Function to open the modal and set the current item code


// Increment item code and save the product when Save button is clicked

// Global inventory data
const inventoryData = [];

// Global variable to track the current item code

// Table body reference
const tableBody = document.querySelector('#inventoryTable tbody');

const colorButtons = document.querySelectorAll('.color-btn');


const modalContent = document.querySelector('.modal-content');

editModal.addEventListener('click', (e) => e.stopPropagation());



const generateRandomSKU = () => {
    const length = Math.floor(Math.random() * (12 - 8 + 1)) + 8; // Random length between 8 and 12
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let sku = '';
    for (let i = 0; i < length; i++) {
        sku += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return sku;
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

// Function to render the table
// Render Table with Edit and Delete Buttons
// Render Table
const renderTable = () => {
    const tableBody = document.querySelector("#inventoryTable tbody");

    tableBody.innerHTML = ""; // Clear existing rows

    inventoryData.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.itemCode}</td>
            <td>${item.sku}</td>
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>${item.threshold}</td>
            <td>${item.status}</td>
            <td>${item.location}</td> <!-- Updated location field -->
            <td>
                <button class="edit-btn" data-id="${item.id}">Edit</button>
                <button class="delete-btn" data-id="${item.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Add event listeners to Edit and Delete buttons
    document.querySelectorAll(".edit-btn").forEach(button =>
        button.addEventListener("click", handleEdit)
    );
    document.querySelectorAll(".delete-btn").forEach(button =>
        button.addEventListener("click", handleDelete)
    );
};


const setupImageHover = () => {
    const tableBody = document.querySelector('#inventoryTable tbody');
    const imagePreview = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');

    tableBody.addEventListener('mouseover', (event) => {
        const row = event.target.closest('tr');
        if (row && row.dataset.imageUrl) {
            previewImage.src = row.dataset.imageUrl;

            // Position the preview near the mouse
            imagePreview.style.top = `${event.clientY + 10}px`;
            imagePreview.style.left = `${event.clientX + 10}px`;
            imagePreview.style.display = 'block';
        }
    });

    tableBody.addEventListener('mouseout', () => {
        imagePreview.style.display = 'none';
    });
};



//Create an edit save button listener



// Add Product Button - Opens modal
// Open Add Product Modal
// Open Add Product Modal
addProductBtn.addEventListener("click", () => {
    editingProductId = null; // Clear editing state.

    const nextItemCode = getNextAvailableItemCode();


    // Clear form fields
    document.getElementById("editItemCode").value = nextItemCode;
    document.getElementById("editSKU").value = generateRandomSKU();
    document.getElementById("editDescription").value = "";
    document.getElementById("editQuantity").value = "";
    document.getElementById("editThreshold").value = "";
    document.getElementById("editCategory").value = "";
    document.getElementById("editLocation").value = "";
    document.getElementById("editPrice").value = "";
    document.getElementById("editCurrency").value = "";

    // Show "Add Save" button, hide "Save Changes" button

    // Hide "Save Edit Changes" button
    editSaveBtn.style.display = "none";
    // Ensure "Save Changes" button is visible
    saveProductBtn.style.display = "block";
    fetchLocations();


    // Show the modal for adding a product
    const editModal = document.getElementById("editInventoryModal");
    editModal.style.display = "flex"; // Show the modal
});


// Save Product Handler - Combines Inventory and Image Handling
saveProductBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // Get product data
    const newProduct = {
        itemCode: parseInt(document.getElementById("editItemCode").value.trim(), 10),
        sku: document.getElementById("editSKU").value.trim(),
        description: document.getElementById("editDescription").value.trim(),
        quantity: parseInt(document.getElementById("editQuantity").value.trim(), 10),
        threshold: parseInt(document.getElementById("editThreshold").value.trim(), 10),
        category: document.getElementById("editCategory").value,
        location: document.getElementById("editLocation").value, // Save selected location
        price: parseFloat(document.getElementById("editPrice").value.trim()),
        currency: document.getElementById("editCurrency").value,
        status: parseInt(document.getElementById("editQuantity").value.trim(), 10) > 0 ? "In Stock" : "Out of Stock",
    };

    try {
        // Save the product to Firestore
        

        // Check if an image was uploaded
        const fileInput = document.getElementById("editPhoto");
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const imageUrl = await saveProductImageToStorage(file, productId); // Save image to Storage
            await saveProductImageToFirestore(productId, imageUrl); // Save metadata to Firestore
        }

        // Update maxItemCode to ensure the correct sequence
        if (newProduct.itemCode > maxItemCode) {
            maxItemCode = newProduct.itemCode;
        }

        // Update the local inventory data
        renderTable(); // Update the table

        // Increment item code for the next product
        currentItemCode++;

        console.log("Product and image saved successfully.");
        alert("Product added successfully!");

        // Reset the form or modal
        fileInput.value = ""; // Clear file input
        editModal.style.display = "none"; // Close modal
        fetchInventory(); // Refresh the table
    } catch (error) {
        console.error("Error saving product:", error);
        alert("Failed to save product. Please try again.");
    }
});


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

setupColorSelection();
setupTabSwitching();
setupAddRemoveOptions();

//=============================================================================================================
//=============================================================================================================
// This is for the Stock and addition of aisles























document.addEventListener("DOMContentLoaded", () => {
    const aisleContainer = document.getElementById("aisleContainer");
    const addAisleBtn = document.getElementById("addAisleBtn");
    const deleteAisleBtn = document.getElementById("deleteAisleBtn");
    const binDetails = document.getElementById("binDetails");
    const addStockToBinBtn = document.getElementById("addStockToBinBtn");
    const subtractStockFromBinBtn = document.getElementById("subtractStockFromBinBtn");
    const binStockQuantity = document.getElementById("binStockQuantity");
    const saveStockChangesBtn = document.getElementById("saveStockChangesBtn");

    let totalProductQuantity = 0; // Quantity fetched from Firebase
    let allocatedQuantity = 0; // Total quantity allocated to bins
    let binStocks = {}; // Track bin-specific stock allocation
    let selectedBin = null;
    let productId = null; // Declare globally or assign the correct ID



    // Validate Allocation Against Total Quantity
    const validateAllocation = () => {
        const remaining = totalProductQuantity - allocatedQuantity;
        binStockQuantity.max = remaining; // Set maximum input value
        binDetails.value += `\nRemaining Quantity: ${remaining}`;
        if (remaining < 0) {
            alert("Total allocation exceeds the available product quantity!");
        }
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

    // Delete Aisle
    // Delete Aisle Functionality
    deleteAisleBtn.addEventListener("click", () => {
        const aisles = aisleContainer.querySelectorAll(".aisle");
        if (aisles.length > 0) {
            const lastAisle = aisles[aisles.length - 1];
            if (confirm("Are you sure you want to delete the last aisle?")) {
                lastAisle.remove();
            }
        } else {
            alert("No aisles to delete!");
        }
    });




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

    window.deleteElement = (button, type) => {
        const element = button.parentNode;
        if (confirm(`Are you sure you want to delete this ${type}?`)) {
            element.remove();
        }
    };

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

    // Attach event listeners to dynamically created bins
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
        bin.innerHTML = `BIN ${binCount} <button class="btn-delete" onclick="deleteElement(this, 'bin')">- Bin</button>`;
        shelf.appendChild(bin);

        // Add click event listener to select the bin
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

        const binLocation = `${bin.dataset.aisle}, ${bin.dataset.rack}, ${bin.dataset.shelf}`;
        binDetails.value = `Location: ${binLocation}\nBin: ${binId}\nStock: ${stock}`;
    };

//This is to add the quantity in the second tab of stocks

    document.getElementById('editQuantity').addEventListener('input', (e) => {
        totalProductQuantity = parseInt(e.target.value, 10) || 0;
        allocatedQuantity = Object.values(binStocks).reduce((sum, qty) => sum + qty, 0);
    });


// Handle Adding Stock to Bins

    addStockToBinBtn.addEventListener('click', () => {
        if (!selectedBin) {
            alert('Please select a bin.');
            return;
        }

        const quantityToAdd = parseInt(binStockQuantity.value, 10) || 0;
        const remaining = totalProductQuantity - allocatedQuantity;

        if (quantityToAdd <= 0 || quantityToAdd > remaining) {
            alert(`Enter a valid quantity (0-${remaining}).`);
            return;
        }

        const binId = selectedBin.dataset.bin;
        binStocks[binId] = (binStocks[binId] || 0) + quantityToAdd;
        allocatedQuantity += quantityToAdd;

        updateBinDetails(binId);
        validateAllocation();
    });


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

        updateBinDetails(binId);
    });

    subtractStockFromBinBtn.addEventListener("click", () => {
        if (!selectedBin) {
            alert("Please select a bin.");
            return;
        }

        const quantityToSubtract = parseInt(binStockQuantity.value, 10) || 0;
        const binId = selectedBin.dataset.bin;

        if (quantityToSubtract <= 0 || quantityToSubtract > (binStocks[binId] || 0)) {
            alert("Enter a valid quantity to subtract.");
            return;
        }

        binStocks[binId] -= quantityToSubtract;
        allocatedQuantity -= quantityToSubtract;

        updateBinDetails(binId);
        validateAllocation();
    });

    // Update Bin Details Display
    const updateBinDetails = (binId) => {
        const binStock = binStocks[binId] || 0;
        const binLocation = `${selectedBin.dataset.aisle}, ${selectedBin.dataset.rack}, ${selectedBin.dataset.shelf}`;
        binDetails.value = `Location: ${binLocation}\nBin: ${binId}\nStock: ${binStock}`;
        binStockQuantity.value = ""; // Clear input field
    };

    // Save Stock Changes to Firebase
    saveStockChangesBtn.addEventListener("click", async () => {
        try {
            const stockDetails = Object.keys(binStocks).map((binId) => {
                const [aisle, rack, shelf] = binId.split("-");
                return {
                    aisle,
                    rack,
                    shelf,
                    bin: binId,
                    quantity: binStocks[binId],
                };
            });

            // Save stock details to the stockDetails collection
            for (const stock of stockDetails) {
                await addDoc(collection(db, "BinStock"), {
                    ...stock,
                    productId, // Include the product ID for reference
                    timestamp: new Date(),
                });
            }

            await updateDoc(productRef, {
                binDetails: stockDetails, // Store all bin details under the product
            });

            alert("Stock details saved successfully to inventory and stock details!");
            binStocks = {}; // Clear bin stocks after saving
            allocatedQuantity = 0; // Reset allocated quantity
            fetchProductQuantity(); // Refresh total product quantity from Firebase
        } catch (error) {
            console.error("Error saving stock details to inventory:", error);
            alert("Failed to save stock details. Please try again.");
        }
    });

    
});

    // Delete Element
    window.deleteElement = (button, type) => {
        const element = button.parentNode;
        if (confirm(`Are you sure you want to delete this ${type}?`)) {
            element.remove();
        }
    };























//========================================================================================================
//========================================================================================================
//THis part is the for the Purchase Order















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


