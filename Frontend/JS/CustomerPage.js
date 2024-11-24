// Import Firebase Firestore
import { getFirestore, collection, getDocs, addDoc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

let currentCustomerId = null; // Track whether you're editing an existing customer



// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZstZmYQ2HOdKX639ayM6L_OoGd64ozqs",
    authDomain: "inventlylogin.firebaseapp.com",
    projectId: "inventlylogin",
    storageBucket: "inventlylogin.appspot.com",
    messagingSenderId: "120631227540",
    appId: "1:120631227540:web:526487d0dcbcdd61c63081"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM elements
const customerTableBody = document.getElementById("customerTableBody");
const addCustomerBtn = document.getElementById("addCustomerBtn");
const modal = document.getElementById("newCustomerModal");
const closeModal = document.getElementById("closeModal");
const cancelCustomer = document.getElementById("cancelCustomer");
const customerIdField = document.getElementById("customerId");
const saveCustomerBtn = document.getElementById("saveCustomer");
const nextToAddress = document.getElementById("nextToAddress");
const customerDetailsForm = document.getElementById("customerDetailsForm");
const addressDetailsForm = document.getElementById("addressDetailsForm");
const backToCustomerInfo = document.getElementById("backToCustomerInfo");


// Function to generate a random customer ID
function generateCustomerId() {
    return "CUST-" + Math.floor(1000 + Math.random() * 9000);
}

// Open the modal and set a random Customer ID
document.addEventListener("DOMContentLoaded", () => {
    const addCustomerBtn = document.getElementById("addCustomerBtn");
    if (addCustomerBtn) {
        addCustomerBtn.addEventListener("click", () => {
            modal.style.display = "flex";
            customerIdField.value = generateCustomerId();
            console.log("Add Customer button clicked!");
        });
    } else {
        console.error("addCustomerBtn element not found.");
    }
});



// Open the modal and set a random Customer ID
document.addEventListener("DOMContentLoaded", () => {
    const addCustomerBtn = document.getElementById("addCustomerBtn");
    const closeModal = document.getElementById("closeModal");
    const cancelCustomer = document.getElementById("cancelCustomer");
    if (addCustomerBtn) {
        addCustomerBtn.addEventListener("click", () => {
            modal.style.display = "flex";
            customerIdField.value = generateCustomerId();
            console.log("Add Customer button clicked!");
        });
    } else {
        console.error("addCustomerBtn element not found.");
    }


    if (closeModal) {
        // Close the modal
        closeModal.addEventListener("click", () => {
            modal.style.display = "none";
            console.log("Close Modal button clicked!");
        });
    } else {
        console.error("closeModal element not found.");
    }

    if (cancelCustomer) {
        cancelCustomer.addEventListener("click", () => {
            modal.style.display = "none";
            console.log("Cancel button clicked!");
        });
    } else {
        console.error("cancelCustomer element not found.");
    }

    // This the address 

    if (nextToAddress) {
        nextToAddress.addEventListener("click", () => {
            customerDetailsForm.style.display = "none";
            addressDetailsForm.style.display = "block";
        });
    } else {
        console.error("nextToAddress button not found.");
    }


    //This to show the customers

    if (backToCustomerInfo) {
        backToCustomerInfo.addEventListener("click", () => {
            addressDetailsForm.style.display = "none";
            customerDetailsForm.style.display = "block";
        });
    } else {
        console.error("backToCustomerInfo button not found.");
    }

});


cancelCustomer.addEventListener("click", () => {
    modal.style.display = "none";
});

// Clear the form
function clearForm() {
    document.getElementById("customerDetailsForm").reset();
    document.getElementById("addressDetailsForm").reset();
    addressDetailsForm.style.display = "none";
    customerDetailsForm.style.display = "block";
}

// Validation function
function validateInputs() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation regex
    const firstName = document.getElementById("firstName").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!firstName) {
        alert("First Name is required.");
        return false;
    }

    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    return true; // All validations passed
}

// Save a new customer to Firestore
saveCustomerBtn.addEventListener("click", async () => {
    const customerType = document.getElementById("customerType").value;
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const companyName = document.getElementById("companyName").value.trim();
    const email = document.getElementById("email").value.trim();
    const customerId = customerIdField.value;
    const phone = document.getElementById("phone").value.trim();
    const paymentTerms = document.getElementById("paymentTerms").value;

    // Billing Address
    const billingCountry = document.getElementById("billingCountry").value.trim();
    const billingAddress = document.getElementById("billingAddress").value.trim();
    const billingCity = document.getElementById("billingCity").value.trim();
    const billingState = document.getElementById("billingState").value.trim();
    const billingZip = document.getElementById("billingZip").value.trim();
    const billingPhone = document.getElementById("billingPhone").value.trim();
    const billingFax = document.getElementById("billingFax").value.trim();

    // Shipping Address
    const shippingCountry = document.getElementById("shippingCountry").value.trim();
    const shippingAddress = document.getElementById("shippingAddress").value.trim();
    const shippingCity = document.getElementById("shippingCity").value.trim();
    const shippingState = document.getElementById("shippingState").value.trim();
    const shippingZip = document.getElementById("shippingZip").value.trim();
    const shippingPhone = document.getElementById("shippingPhone").value.trim();
    const shippingFax = document.getElementById("shippingFax").value.trim();

    if (!validateInputs()) return;

    try {
        const customerData = {
            customerType,
            name: `${firstName} ${lastName}`.trim(),
            companyName: companyName || "",
            email,
            customerId,
            workPhone: phone || "",
            receivables: "$0.00",
            paymentTerms,
            billingAddress: {
                country: billingCountry,
                address: billingAddress,
                city: billingCity,
                state: billingState,
                zip: billingZip,
                phone: billingPhone,
                fax: billingFax,
            },
            shippingAddress: {
                country: shippingCountry,
                address: shippingAddress,
                city: shippingCity,
                state: shippingState,
                zip: shippingZip,
                phone: shippingPhone,
                fax: shippingFax,
            },
        };

        if (currentCustomerId) {
            // Update existing customer
            const customerRef = doc(db, "customers", currentCustomerId);
            await setDoc(customerRef, customerData, { merge: true });
            console.log("Customer updated:", customerData);
        } else {
            // Add new customer
            const docRef = await addDoc(collection(db, "customers"), customerData);
            console.log("New customer added:", customerData);
            currentCustomerId = docRef.id; // Update the global state with the new customer's ID
        }

        // Refresh the customer list
        await loadCustomers();

        // Reset form and close modal
        modal.style.display = "none";
        clearForm();
        currentCustomerId = null; // Reset the global state
    } catch (error) {
        console.error("Error saving customer:", error);
    }
});

// Fetch customers from Firestore and populate the table
async function loadCustomers() {
    const customerCollection = collection(db, "customers");
    const querySnapshot = await getDocs(customerCollection);

    // Clear the table before adding rows
    customerTableBody.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const customer = doc.data();
        addCustomerToTable(customer, doc.id); // Pass the document ID
    });
}

// Add a customer row to the table
function addCustomerToTable(customer, docId) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${customer.name || ""}</td>
        <td>${customer.companyName || ""}</td>
        <td>${customer.email || ""}</td>
        <td>${customer.workPhone || ""}</td>
        <td>${customer.receivables || "$0.00"}</td>
                <td>
            <button class="edit-btn" data-id="${docId}">Edit</button>
            <button class="delete-btn" data-id="${docId}">Delete</button>
        </td>
    `;
    customerTableBody.appendChild(row);

    // Attach event listener to the delete button
    row.querySelector(".delete-btn").addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");

        // Show confirmation dialog
        if (confirm("Are you sure you want to delete this customer?")) {
            await deleteCustomer(id);
            row.remove(); // Remove the row from the table
        }
    });

    // Attach event listener to the edit button
    row.querySelector(".edit-btn").addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");
        editCustomer(id);
    });
}

async function editCustomer(docId) {
    try {
        const customerRef = doc(db, "customers", docId);
        const customerDoc = await getDoc(customerRef);

        if (customerDoc.exists()) {
            const customer = customerDoc.data();

            // Pre-fill the modal fields with customer data
            document.getElementById("customerType").value = customer.customerType || "Business";
            document.getElementById("firstName").value = customer.name.split(" ")[0] || "";
            document.getElementById("lastName").value = customer.name.split(" ")[1] || "";
            document.getElementById("companyName").value = customer.companyName || "";
            document.getElementById("email").value = customer.email || "";
            document.getElementById("customerId").value = customer.customerId || "";
            document.getElementById("phone").value = customer.workPhone || "";
            document.getElementById("paymentTerms").value = customer.paymentTerms || "";

            // Pre-fill billing address
            document.getElementById("billingCountry").value = customer.billingAddress?.country || "";
            document.getElementById("billingAddress").value = customer.billingAddress?.address || "";
            document.getElementById("billingCity").value = customer.billingAddress?.city || "";
            document.getElementById("billingState").value = customer.billingAddress?.state || "";
            document.getElementById("billingZip").value = customer.billingAddress?.zip || "";
            document.getElementById("billingPhone").value = customer.billingAddress?.phone || "";
            document.getElementById("billingFax").value = customer.billingAddress?.fax || "";

            // Pre-fill shipping address
            document.getElementById("shippingCountry").value = customer.shippingAddress?.country || "";
            document.getElementById("shippingAddress").value = customer.shippingAddress?.address || "";
            document.getElementById("shippingCity").value = customer.shippingAddress?.city || "";
            document.getElementById("shippingState").value = customer.shippingAddress?.state || "";
            document.getElementById("shippingZip").value = customer.shippingAddress?.zip || "";
            document.getElementById("shippingPhone").value = customer.shippingAddress?.phone || "";
            document.getElementById("shippingFax").value = customer.shippingAddress?.fax || "";

            // Show the modal
            modal.style.display = "flex";

            // Set global state for editing
            currentCustomerId = docId;
        }
    } catch (error) {
        console.error("Error editing customer:", error);
    }
}

// Function to delete a customer from Firestore
async function deleteCustomer(docId) {
    try {
        await deleteDoc(doc(db, "customers", docId));
        console.log("Customer deleted successfully!");
    } catch (error) {
        console.error("Error deleting customer: ", error);
    }
}

// Load customers on page load
document.addEventListener("DOMContentLoaded", loadCustomers);

export const auth = getAuth(app); // Export the Auth instance



// Function to save a new inventory item to Firestore
async function saveNewItemToFirestore(newItem) {
    const inventoryRef = doc(db, "inventory", "mhi1OrJnP6xSZAvgpZ64");

    try {
        // Check if the document exists
        const docSnapshot = await getDoc(inventoryRef);

        if (docSnapshot.exists()) {
            // Document exists, update the array field
            await setDoc(
                inventoryRef,
                { items: arrayUnion(newItem) },
                { merge: true } // Merge with existing data
            );
            console.log("New item successfully added to Firestore:", newItem);
        } else {
            // Document doesn't exist, create it with the first item
            await setDoc(inventoryRef, { items: [newItem] });
            console.log("Document created and new item added to Firestore:", newItem);
        }
    } catch (error) {
        console.error("Error adding new item to Firestore:", error);
    }
}

// Example usage of `saveNewItemToFirestore`
const addProductButton = document.getElementById("addProductBtn");
addProductButton.addEventListener("click", () => {
    const newItem = {
        itemCode: Math.floor(Math.random() * 1000).toString().padStart(3, "0"),
        sku: `SKU${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
        description: "New Product",
        quantity: 10,
        threshold: 5,
        status: "In Stock",
        location: "A01"
    };

    // Save the new item to Firestore
    saveNewItemToFirestore(newItem);
});

async function saveCustomerChanges(docId) {
    const customerType = document.getElementById("customerType").value;
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const companyName = document.getElementById("companyName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const paymentTerms = document.getElementById("paymentTerms").value;

    // Billing Address
    const billingCountry = document.getElementById("billingCountry").value.trim();
    const billingAddress = document.getElementById("billingAddress").value.trim();
    const billingCity = document.getElementById("billingCity").value.trim();
    const billingState = document.getElementById("billingState").value.trim();
    const billingZip = document.getElementById("billingZip").value.trim();
    const billingPhone = document.getElementById("billingPhone").value.trim();
    const billingFax = document.getElementById("billingFax").value.trim();

    // Shipping Address
    const shippingCountry = document.getElementById("shippingCountry").value.trim();
    const shippingAddress = document.getElementById("shippingAddress").value.trim();
    const shippingCity = document.getElementById("shippingCity").value.trim();
    const shippingState = document.getElementById("shippingState").value.trim();
    const shippingZip = document.getElementById("shippingZip").value.trim();
    const shippingPhone = document.getElementById("shippingPhone").value.trim();
    const shippingFax = document.getElementById("shippingFax").value.trim();

    try {
        const updatedCustomer = {
            customerType,
            name: `${firstName} ${lastName}`,
            companyName,
            email,
            workPhone: phone,
            paymentTerms,
            billingAddress: {
                country: billingCountry,
                address: billingAddress,
                city: billingCity,
                state: billingState,
                zip: billingZip,
                phone: billingPhone,
                fax: billingFax,
            },
            shippingAddress: {
                country: shippingCountry,
                address: shippingAddress,
                city: shippingCity,
                state: shippingState,
                zip: shippingZip,
                phone: shippingPhone,
                fax: shippingFax,
            },
        };

        const customerRef = doc(db, "customers", docId);
        await setDoc(customerRef, updatedCustomer, { merge: true });

        console.log("Customer updated:", updatedCustomer); // Debugging log
        await loadCustomers(); // Refresh table data
        console.log("Customer list reloaded");

        // Show a success alert after saving changes
        alert("Customer details updated successfully!");
    } catch (error) {
        console.error("Error saving changes: ", error);
    }
}

const updatedRow = document.querySelector(`[data-id="${docId}"]`);
updatedRow.innerHTML = `
    <td>${updatedCustomer.name}</td>
    <td>${updatedCustomer.companyName}</td>
    <td>${updatedCustomer.email}</td>
    <td>${updatedCustomer.workPhone}</td>
    <td>${updatedCustomer.receivables || "$0.00"}</td>
    <td>
        <button class="edit-btn" data-id="${docId}">Edit</button>
        <button class="delete-btn" data-id="${docId}">Delete</button>
    </td>
`;
