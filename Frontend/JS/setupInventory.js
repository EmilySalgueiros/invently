// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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
const auth = getAuth(app);

// DOM Elements
const modal = document.getElementById('createInventoryModal');
const closeButton = document.querySelector('.close-btn');
const addInventoryBtn = document.querySelector('.addInventoryButton');
const saveInventoryBtn = document.getElementById("saveInventory");
const inventoryDetailsForm = document.getElementById("inventoryDetailsForm");
const addressDetailsForm = document.getElementById("addressDetailsForm");
const nextToAddress = document.getElementById("nextToAddress");
const backToInventoryInfo = document.getElementById("backToInventoryInfo");
const inventoryDashboard = document.querySelector('.inventory-dashboard');

// Global state
let currentInventoryId = null;

// Modal Handling
if (modal && addInventoryBtn && closeButton) {
    addInventoryBtn.addEventListener('click', () => {
        modal.style.display = 'flex'; // Show modal
        clearForm(); // Reset form fields
    });

    closeButton.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    nextToAddress.addEventListener('click', () => {
        inventoryDetailsForm.style.display = 'none';
        addressDetailsForm.style.display = 'block';
    });

    backToInventoryInfo.addEventListener('click', () => {
        addressDetailsForm.style.display = 'none';
        inventoryDetailsForm.style.display = 'block';
    });

    saveInventoryBtn.addEventListener('click', saveInventory);
} else {
    console.error('Modal or required elements not found!');
}

// Close modal and reset form
function closeModal() {
    modal.style.display = 'none';
    clearForm();
}

// Save Inventory Data
async function saveInventory() {
    const user = auth.currentUser; // Get logged-in user
    if (!user) {
        alert("You must be logged in to save inventory.");
        return;
    }

    // Collect data from form
    const inventoryData = {
        inventoryType: document.getElementById("inventoryType")?.value || "Unknown",
        name: `${document.getElementById("firstName")?.value?.trim() || "N/A"} ${document.getElementById("lastName")?.value?.trim() || "N/A"}`.trim(),
        inventoryName: document.getElementById("inventoryName")?.value?.trim() || "",
        email: document.getElementById("email")?.value?.trim() || "",
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
        },
        userId: user.uid, // Associate inventory with logged-in user
        createdAt: new Date()
    };

    try {
        console.log("Saving inventory:", inventoryData);

        // Save to Firestore
        const docRef = await addDoc(collection(db, "inventories"), inventoryData);
        console.log("Inventory saved with ID:", docRef.id);

        // Update UI
        createInventoryCard(docRef.id, inventoryData.inventoryName);

        // Close modal and reset form
        closeModal();
    } catch (error) {
        console.error("Error saving inventory:", error);
        alert(`Error saving inventory: ${error.message}`);
    }
}

// Clear Form Fields
function clearForm() {
    inventoryDetailsForm.reset();
    addressDetailsForm.reset();
    inventoryDetailsForm.style.display = "block";
    addressDetailsForm.style.display = "none";
    currentInventoryId = null;
}

// Create Inventory Card
function createInventoryCard(inventoryId, inventoryName) {
    const inventoryDashboard = document.querySelector('.cards-container');

    // Create the tile element
    const inventoryCard = document.createElement('div');
    inventoryCard.className = 'inventory-card';
    inventoryCard.innerHTML = `
        <h3>${inventoryName}</h3>
    `;
    inventoryCard.addEventListener('click', () => {
        window.location.href = `../HTML/dashboard.html?inventoryId=${inventoryId}`;
    });
    inventoryDashboard.appendChild(inventoryCard);
}

// Fetch and Display User's Inventories
async function loadUserInventories() {
    const user = auth.currentUser;
    if (!user) {
        console.log("No user is logged in.");
        inventoryDashboard.innerHTML = "<p>Please log in to view your inventories.</p>";
        return;
    }

    try {
        // Fetch inventories where userId matches the logged-in user's UID
        const inventoriesQuery = query(
            collection(db, "inventories"),
            where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(inventoriesQuery);

        // Clear existing inventory cards
        inventoryDashboard.innerHTML = "";

        // Render inventory cards
        querySnapshot.forEach((doc) => {
            const inventory = doc.data();
            createInventoryCard(doc.id, inventory.inventoryName);
        });

        if (querySnapshot.empty) {
            inventoryDashboard.innerHTML = "<p>You have no inventories. Create one to get started!</p>";
        }
    } catch (error) {
        console.error("Error loading inventories:", error);
    }
}

// Fetch and display user's inventories on page load
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User logged in:", user);

        try {
            const querySnapshot = await getDocs(query(
                collection(db, "inventories"),
                where("userId", "==", user.uid)
            ));

            querySnapshot.forEach((doc) => {
                const inventory = doc.data();
                createInventoryCard(doc.id, inventory.inventoryName);
            });
        } catch (error) {
            console.error("Error fetching inventories:", error);
        }
    } else {
        console.log("No user logged in.");
        inventoryDashboard.innerHTML = "<p>Please log in to view your inventories.</p>";
    }
});
