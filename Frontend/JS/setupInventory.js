// Import Firebase Firestore
import { getFirestore, collection, addDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

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
const modal = document.getElementById('createInventoryModal');
const closeButton = document.querySelector('.close-btn');
const addInventoryBtn = document.querySelector('.addInventoryButton');
const saveInventoryBtn = document.getElementById("saveInventory");
const inventoryIdField = document.getElementById("inventoryId");
const inventoryDetailsForm = document.getElementById("inventoryDetailsForm");
const addressDetailsForm = document.getElementById("addressDetailsForm");
const nextToAddress = document.getElementById("nextToAddress");
const backToInventoryInfo = document.getElementById("backToInventoryInfo");
let currentInventoryId = null; // Global state for inventory ID

// Check if modal and trigger elements exist
if (modal && addInventoryBtn && closeButton) {
    // Show the modal when the button is clicked
    addInventoryBtn.addEventListener('click', () => {
        modal.style.display = 'flex'; // Use 'flex' to ensure alignment works with CSS
        inventoryIdField.value = generateInventoryId(); // Set a random Inventory ID
        document.getElementById("inventoryID").value = generateInventoryId(); // Generate new ID
        clearForm(); // Clear the form fields
    });

    // Hide the modal when the close button is clicked
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        clearForm();
    });

    // Hide the modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            clearForm();
        }
    });

    // Navigate between forms
    nextToAddress.addEventListener('click', () => {
        inventoryDetailsForm.style.display = 'none';
        addressDetailsForm.style.display = 'block';
    });

    backToInventoryInfo.addEventListener('click', () => {
        addressDetailsForm.style.display = 'none';
        inventoryDetailsForm.style.display = 'block';
    });


    saveInventoryBtn.addEventListener("click", async () => {
        const inventoryData = {
            inventoryType: document.getElementById("inventoryType")?.value || "Unknown",
            name: `${document.getElementById("firstName")?.value?.trim() || "N/A"} ${document.getElementById("lastName")?.value?.trim() || "N/A"}`.trim(),
            inventoryName: document.getElementById("inventoryName")?.value?.trim() || "",
            email: document.getElementById("email")?.value?.trim() || "",
            inventoryId: inventoryIdField?.value || "Unknown-ID",
            paymentTerms: document.getElementById("paymentTerms")?.value?.trim() || "N/A",
            billingAddress: {
                country: document.getElementById("billingCountry")?.value?.trim() || "N/A",
                address: document.getElementById("billingAddress")?.value?.trim() || "",
                city: document.getElementById("billingCity")?.value?.trim() || "",
                state: document.getElementById("billingState")?.value?.trim() || "",
                zip: document.getElementById("billingZip")?.value?.trim() || "",
                phone: document.getElementById("billingPhone")?.value?.trim() || ""
            },
            shippingAddress: {
                country: document.getElementById("shippingCountry")?.value?.trim() || "N/A",
                address: document.getElementById("shippingAddress")?.value?.trim() || "",
                city: document.getElementById("shippingCity")?.value?.trim() || "",
                state: document.getElementById("shippingState")?.value?.trim() || "",
                zip: document.getElementById("shippingZip")?.value?.trim() || "",
                phone: document.getElementById("shippingPhone")?.value?.trim() || ""
            }
        };
    
        console.log("Data being saved to Firestore:", inventoryData);
    
        try {
            let docRef; // Declare docRef for access outside the if-else block
    
            if (currentInventoryId) {
                console.log("Updating existing inventory:", currentInventoryId);
                const inventoryRef = doc(db, "inventories", currentInventoryId);
                await setDoc(inventoryRef, inventoryData, { merge: true });
                docRef = inventoryRef;
                console.log("Inventory updated successfully:", inventoryData);
            } else {
                console.log("Adding new inventory");
                docRef = await addDoc(collection(db, "inventories"), inventoryData);
                console.log("New inventory added with Firestore ID:", docRef.id);
            }
    
            // Pass the correct ID and Name to createInventoryCard
            createInventoryCard(docRef.id, inventoryData.inventoryName);
    
            modal.style.display = 'none';
            clearForm();
        } catch (error) {
            console.error("Error saving inventory to Firestore:", error.message);
            alert(`An error occurred: ${error.message}`);
        }
    });
    
} else {
    console.error('Modal or required elements not found!');
}

// Utility functions

// Generate a random Inventory ID
function generateInventoryId() {
    return "INVT-" + Math.floor(1000 + Math.random() * 9000);
}

// Clear form fields
function clearForm() {
    inventoryDetailsForm.reset();
    addressDetailsForm.reset();
    inventoryDetailsForm.style.display = "block";
    addressDetailsForm.style.display = "none";
}

// Validate input fields
function validateInputs() {
    const name = document.getElementById("firstName").value.trim();
    const email = document.getElementById("email").value.trim();
    if (!name) {
        alert("First Name is required.");
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }
    return true;
}

// Function to Create and Add a New Inventory Tile
function createInventoryCard(inventoryId, inventoryName) {
    const inventoryDashboard = document.querySelector('.inventory-dashboard');

    // Create the tile element
    const inventoryCard = document.createElement('div');
    inventoryCard.className = 'inventory-card';
    inventoryCard.innerHTML = `
        <h3>${inventoryName}</h3>
        <p>Click to view dashboard</p>
    `;

    // Add click event to navigate to the detailed dashboard
    inventoryCard.addEventListener('click', () => {
        window.location.href = "../HTML/dashboard.html";
    });

    // Append the tile to the dashboard
    inventoryDashboard.appendChild(inventoryCard);
}
