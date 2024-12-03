// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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





//---------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------



//Now this is for the Vendors

// Helper Functions
function generateId(prefix = "ID") {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const timestamp = Date.now().toString().slice(-4);
    return `${prefix}-${randomNum}-${timestamp}`;
}

function showModal(modal) {
    modal.style.display = "flex";
}

function hideModal(modal) {
    modal.style.display = "none";
}

// Vendors Logic
async function loadVendors() {
    const vendorsTableBody = document.getElementById("vendorsTableBody");
    vendorsTableBody.innerHTML = ""; // Clear the table
    try {
        const querySnapshot = await getDocs(collection(db, "vendors"));
        querySnapshot.forEach((doc) => {
            const vendor = doc.data();
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${vendor.vendorId}</td>
                <td>${vendor.firstName}</td>
                <td>${vendor.lastName}</td>
                <td>${vendor.companyName}</td>
                <td>${vendor.phone}</td>
                <td>${vendor.address}</td>
                <td>${vendor.email}</td>
                <td>
                    <button class="edit-vendor-btn" data-id="${doc.id}">Edit</button>
                    <button class="delete-vendor-btn" data-id="${doc.id}">Delete</button>
                </td>
            `;
            vendorsTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching vendors:", error);
    }
}

async function saveVendor() {
    const vendorIdField = document.getElementById("vendorId");
    const firstName = document.getElementById("vendorFirstNameInput").value;
    const lastName = document.getElementById("vendorLastNameInput").value;
    const companyName = document.getElementById("vendorCompanyNameInput").value;
    const phone = document.getElementById("vendorPhoneInput").value;
    const address = document.getElementById("vendorAddressInput").value;
    const email = document.getElementById("vendorEmailInput").value;

    if (!firstName || !lastName || !companyName || !phone) {
        alert("Please fill in all required fields.");
        return;
    }

    try {
        const vendorId = vendorIdField.value || generateId("VID");
        await setDoc(doc(db, "vendors", vendorId), {
            vendorId,
            firstName,
            lastName,
            companyName,
            phone,
            address,
            email,
        }, { merge: true });
        alert("Vendor saved successfully!");
        hideModal(document.getElementById("addVendorModal"));
        loadVendors();
    } catch (error) {
        console.error("Error saving vendor:", error);
        alert("Failed to save vendor. Please try again.");
    }
}

async function deleteVendor(docId) {
    if (!confirm("Are you sure you want to delete this vendor?")) return;

    try {
        await deleteDoc(doc(db, "vendors", docId));
        alert("Vendor deleted successfully!");
        loadVendors();
    } catch (error) {
        console.error("Error deleting vendor:", error);
        alert("Failed to delete vendor. Please try again.");
    }
}



// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    // Load Vendors on page load
    loadVendors();

    // Vendors Modal Logic
    document.getElementById("addVendorBtn").addEventListener("click", () => {
        const vendorIdField = document.getElementById("vendorId");
        vendorIdField.value = generateId("VID");
        showModal(document.getElementById("addVendorModal"));
    });

    document.getElementById("saveVendorBtn").addEventListener("click", saveVendor);
    document.getElementById("cancelVendorBtn").addEventListener("click", () => {
        hideModal(document.getElementById("addVendorModal"));
    });




    // Delegated Event Listeners for dynamic elements
    document.addEventListener("click", (event) => {
        const target = event.target;

        // Vendor Edit
        if (target.classList.contains("edit-vendor-btn")) {
            const row = target.closest("tr");
            document.getElementById("vendorId").value = row.cells[0].textContent;
            document.getElementById("vendorFirstNameInput").value = row.cells[1].textContent;
            document.getElementById("vendorLastNameInput").value = row.cells[2].textContent;
            document.getElementById("vendorCompanyNameInput").value = row.cells[3].textContent;
            document.getElementById("vendorPhoneInput").value = row.cells[4].textContent;
            document.getElementById("vendorAddressInput").value = row.cells[5].textContent;
            document.getElementById("vendorEmailInput").value = row.cells[6].textContent;
            showModal(document.getElementById("addVendorModal"));
        }

        // Vendor Delete
        if (target.classList.contains("delete-vendor-btn")) {
            deleteVendor(target.dataset.id);
        }
    });
});





//---------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------



//Now this is for the Orders


// Orders Logic
function resetOrderModal() {
    const orderInputs = document.querySelectorAll("#addOrderModal input");
    orderInputs.forEach((input) => (input.value = ""));
}

// This function toggle the paid status







//This function will show in the modal the different vendors possible to select from

async function populateCompanyDropdown(selectedCompany) {
    const companySelect = document.getElementById("companySelect");
    companySelect.innerHTML = '<option value="" disabled selected>Select Company</option>'; // Clear existing options

    try {
        const querySnapshot = await getDocs(collection(db, "vendors"));
        querySnapshot.forEach((doc) => {
            const vendor = doc.data();
            const option = document.createElement("option");
            option.value = doc.id; // Use vendor ID as the value
            option.textContent = `${vendor.companyName} - ${vendor.firstName} ${vendor.lastName}`;
            
            // Pre-select the current company
            if (doc.id === selectedCompany) {
                option.selected = true;
            }
            companySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching vendors for dropdown:", error);
        alert("Failed to load companies. Please try again.");
    }
}

//This function will show in the modal in the order to, the company selected in the order to option

document.getElementById("companySelect").addEventListener("change", async (event) => {
    const selectedVendorId = event.target.value;
    console.log("Selected Vendor ID:", selectedVendorId); // Debugging


    try {
        const vendorDoc = await getDoc(doc(db, "vendors", selectedVendorId));
        if (vendorDoc.exists()) {
            const vendor = vendorDoc.data();
            console.log("Selected Vendor ID:", selectedVendorId); // Debugging
            document.getElementById("orderToCompany").value = `${vendor.companyName}\n${vendor.address}\n${vendor.phone}`;
        } else {
            console.error("Vendor document does not exist in Firestore.");
            alert("Vendor not found. Please try again.");
        }
    } catch (error) {
        console.error("Error fetching vendor details:", error);
        alert("Failed to load vendor details. Please try again.");
    }
});


// This is the function that will create the date of today in the respective field in the modal
function getCurrentDate() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add 1 to month as it is 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `${month}/${day}/${year}`;
}

// This is the function that will create the random order number

function generateOrderNumber() {
    const randomNum = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit random number
    const timestamp = Date.now().toString().slice(-4); // Use the last 4 digits of the current timestamp
    return `ORD-${randomNum}-${timestamp}`; // Combine for a unique order number
}


// This function will make the orders disappear

async function deleteOrder(docId) {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
        await deleteDoc(doc(db, "orders", docId));
        alert("Order deleted successfully!");
        loadOrders();
    } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete order. Please try again.");
    }
}




// This function wil let me save my order in firebase 
async function saveOrder() {
    const orderNumber = document.getElementById("orderNumber").value; // Use this to identify the order being edited
    const companySelect = document.getElementById("companySelect");
    const selectedVendorId = companySelect.value;
    const selectedVendorName = companySelect.options[companySelect.selectedIndex]?.text || ""; // Fetch the display text (company name)
    const orderDate = document.getElementById("orderDate").value;
    const orderToCompany = document.getElementById("orderToCompany").value;
    const totalAmount = document.getElementById("totalAmount").value;
    const balanceDue = document.getElementById("balanceDue").value;
    const selectedCompany = companySelect.value;

    


    // Determine status based on balanceDue
    const status = balanceDue === "0" || balanceDue === 0 ? "Paid" : "Pending";

    // Validate required fields
    if (!orderNumber || !selectedVendorId || !orderDate || !orderToCompany) {
        alert("Please fill in all required fields.");
        return;
    }

    // Collect order items
    const orderItemsBody = document.getElementById("orderItemsBody");
    const orderItems = [];
    const rows = orderItemsBody.querySelectorAll("tr");
    rows.forEach((row) => {
        const itemName = row.querySelector("input[placeholder='Item Name']").value;
        const quantity = row.querySelector("input[placeholder='Qty']").value;
        const description = row.querySelector("input[placeholder='Description']").value;
        const rate = row.querySelector("input[placeholder='Rate']").value;
        const amount = row.querySelector("input[placeholder='Amount']").value;

        if (itemName) {
            orderItems.push({ itemName, quantity, description, rate, amount });
        }
    });

    try {
        // Save or update order in Firestore
        await setDoc(doc(db, "orders", orderNumber), {
            "Order#": orderNumber,
            vendorId: selectedVendorId, // Save vendor ID
            companyName: selectedVendorName, // Save company name
            Date: orderDate,
            OrderTo: orderToCompany,
            Items: orderItems,
            totalAmount,
            balanceDue,
            status, // Add status field
        });

        alert("Order saved successfully!");
        hideModal(document.getElementById("addOrderModal"));
        loadOrders(); // Refresh the table
    } catch (error) {
        console.error("Error saving order:", error);
        alert("Failed to save order. Please try again.");
    }
}

//Function that will load the order from firebase and display them in the table

async function loadOrders() {
    const ordersTableBody = document.getElementById("ordersTableBody");
    ordersTableBody.innerHTML = ""; // Clear existing rows

    try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        querySnapshot.forEach((doc) => {
            const order = doc.data();

            const row = document.createElement("tr");
            const statusText = order.status === "Paid" ? "Paid" : "Pending"; // Convert boolean to text

            row.innerHTML = `
                <td>${order["Order#"]}</td>
                <td>${order.companyName}</td>
                <td>${order.Date}</td>
                <td>${order.Items ? order.Items.length : 0}</td>
                <td>${order.totalAmount}</td>
                <td class="status-cell">${statusText}</td>

                <td>
                    <button class="edit-order-btn" data-id="${doc.id}">Edit</button>
                    <button class="delete-order-btn" data-id="${doc.id}">Delete</button>
                    <button class="toggle-status-btn" data-id="${doc.id}">${order.status === "Paid" ? "Pending" : "Paid"}</button>

                </td>
            `;
            ordersTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading orders:", error);
        alert("Failed to load orders. Please try again.");
    }
}


// Function to toggle order status

async function toggleOrderStatus(orderId) {
    try {
        const orderDoc = await getDoc(doc(db, "orders", orderId));
        if (orderDoc.exists()) {
            const order = orderDoc.data();
            const newStatus = order.status === "Paid" ? "Pending" : "Paid";

            // Update Firestore with the new status
            await setDoc(doc(db, "orders", orderId), { status: newStatus }, { merge: true });

            alert(`Order status updated to: ${newStatus}`);
            loadOrders(); // Refresh the table
        } else {
            alert("Order not found!");
        }
    } catch (error) {
        console.error("Error toggling status:", error);
        alert("Failed to toggle status. Please try again.");
    }
}



//Event listener for order
document.addEventListener("DOMContentLoaded", () => {

    // Load orders on page load
    loadOrders(); // Ensure orders are loaded immediately when the page is refreshed

    // This is the save order button
    document.getElementById("saveOrderBtn").addEventListener("click", saveOrder);

    //This is the cancel order button
    document.getElementById("cancelOrderBtn").addEventListener("click", () => {
        hideModal(document.getElementById("addOrderModal"));
    });

    // Orders Modal Logic
    document.getElementById("addOrderBtn").addEventListener("click", () => {
        resetOrderModal();
        populateCompanyDropdown(); // Populate the dropdown with vendor data
        document.getElementById("orderDate").value = getCurrentDate(); // Set today's date
        document.getElementById("orderNumber").value = generateOrderNumber(); // Set a random order number
        showModal(document.getElementById("addOrderModal"));
    });

    // Delegated Event Listeners for dynamic elements
    // Delegated Event Listeners for dynamic elements

    let lastSelectedCompany = ""; // Global variable to store the last selected company


    document.addEventListener("click", async (event) => {
        const target = event.target;

        // Order Edit
        if (target.classList.contains("edit-order-btn")) {
            const orderId = target.dataset.id; // Get the Firestore document ID
            console.log("Editing Order ID:", orderId); // Debugging

            try {
                // Fetch the order data from Firestore
                const orderDoc = await getDoc(doc(db, "orders", orderId));
                if (orderDoc.exists()) {
                    const order = orderDoc.data();

                    // Populate the modal fields with order data
                    document.getElementById("orderNumber").value = order["Order#"];
                    document.getElementById("orderDate").value = order.Date;
                    document.getElementById("orderToCompany").value = order.OrderTo;

                    // Set the company dropdown
                    const companySelect = document.getElementById("companySelect");
                    companySelect.innerHTML = ""; // Clear existing options

                    // Populate the dropdown and ensure the correct company is selected
                    await populateCompanyDropdown(order.companyName);

                    // Set the selected company
                    companySelect.value = order.companyName;

                    // Populate order items
                    const orderItemsBody = document.getElementById("orderItemsBody");
                    orderItemsBody.innerHTML = ""; // Clear existing rows
                    order.Items.forEach((item) => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                        <td><input type="text" placeholder="Item Name" value="${item.itemName}"></td>
                        <td><input type="number" placeholder="Qty" value="${item.quantity}"></td>
                        <td><input type="text" placeholder="Description" value="${item.description}"></td>
                        <td><input type="number" placeholder="Rate" value="${item.rate}"></td>
                        <td><input type="number" placeholder="Amount" value="${item.amount}" readonly></td>
                    `;
                        orderItemsBody.appendChild(row);
                    });

                    // Populate total and balance due
                    document.getElementById("totalAmount").value = order.totalAmount;
                    document.getElementById("balanceDue").value = order.balanceDue;

                    // Show the modal
                    showModal(document.getElementById("addOrderModal"));
                } else {
                    alert("Order not found!");
                }
            } catch (error) {
                console.error("Error fetching order:", error); // Detailed error
                alert("Failed to fetch order. Please try again.");
            }
        }

        // Order Delete
        if (target.classList.contains("delete-order-btn")) {
            deleteOrder(target.dataset.id);
        }

        // Order Toggle Button
        if (target.classList.contains("toggle-status-btn")) {
            const orderId = target.dataset.id;
            toggleOrderStatus(orderId);
        }
        // Add Item Button
        if (target.id === "addRowBtn") { // Assuming the button has an ID "addItemBtn"
            const orderItemsBody = document.getElementById("orderItemsBody");

            if (orderItemsBody) {
                // Create a new row for the item
                const newRow = document.createElement("tr");
                newRow.innerHTML = `
                <td><input type="text" placeholder="Item Name"></td>
                <td><input type="number" placeholder="Qty"></td>
                <td><input type="text" placeholder="Description"></td>
                <td><input type="number" placeholder="Rate"></td>
                <td><input type="number" placeholder="Amount" readonly></td>
            `;
                orderItemsBody.appendChild(newRow);
            }
        }
    });

    

    // Delegated Input Listener for Quantity and Rate Changes
    document.addEventListener("input", (event) => {
        const target = event.target;

        // Check if the input is in the modal table (Quantity or Rate fields)
        if (target.closest("#orderItemsBody")) {
            const row = target.closest("tr");
            const quantityInput = row.querySelector("input[placeholder='Qty']");
            const rateInput = row.querySelector("input[placeholder='Rate']");
            const amountInput = row.querySelector("input[placeholder='Amount']");

            if (quantityInput && rateInput && amountInput) {
                const quantity = parseFloat(quantityInput.value) || 0;
                const rate = parseFloat(rateInput.value) || 0;

                // Calculate the amount
                const amount = quantity * rate;

                // Update the Amount field
                amountInput.value = amount.toFixed(2);

                // Update the Total and Balance Due
                updateOrderTotals();
            }
        }
    });

    // Function to Update Totals and Balance Due
    function updateOrderTotals() {
        const orderItemsBody = document.getElementById("orderItemsBody");
        const rows = orderItemsBody.querySelectorAll("tr");

        let total = 0;

        rows.forEach((row) => {
            const amountInput = row.querySelector("input[placeholder='Amount']");
            const amount = parseFloat(amountInput.value) || 0;
            total += amount;
        });

        // Update Total and Balance Due fields
        document.getElementById("totalAmount").value = total.toFixed(2);
        document.getElementById("balanceDue").value = total.toFixed(2); // Assuming full balance due initially
    }





});
