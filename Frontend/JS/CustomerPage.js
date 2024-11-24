// Import Firebase Firestore
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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
addCustomerBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    customerIdField.value = generateCustomerId();
});

// Close the modal
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

cancelCustomer.addEventListener("click", () => {
    modal.style.display = "none";
});

// Close modal if user clicks outside of it
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// Show the Address Form
nextToAddress.addEventListener("click", () => {
    customerDetailsForm.style.display = "none";
    addressDetailsForm.style.display = "block";
});

// Show the Customer Info Form (Back Button)
backToCustomerInfo.addEventListener("click", () => {
    addressDetailsForm.style.display = "none";
    customerDetailsForm.style.display = "block";
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
        const newCustomer = {
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

        const docRef = await addDoc(collection(db, "customers"), newCustomer);
        addCustomerToTable(newCustomer, docRef.id); // Pass the document ID
        modal.style.display = "none";
        clearForm();
    } catch (error) {
        console.error("Error adding document: ", error);
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
        <td><button class="delete-btn" data-id="${docId}">Delete</button></td>
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

// DOM elements
const usernameDisplay = document.getElementById("username-display");

// Check authentication state
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            // Fetch user data from Firestore
            console.log("User is authenticated:", user.uid);
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                console.log("User document data:", userDoc.data()); // Debugging Firestore data
                // Extract the username
                const username = userDoc.data().username;
                usernameDisplay.textContent = username; // Display the username
            } else {
                console.error("User document not found in Firestore");
                usernameDisplay.textContent = "User"; // Fallback if username is not found
            }
        } catch (error) {
            console.error("Error fetching username:", error);
            usernameDisplay.textContent = "Error";
        }
    } else {
        console.error("User not authenticated. Redirecting to login...");
        // Redirect to login page if not logged in
        window.location.href = "../HTML/loginInvently.html";
    }
});

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
