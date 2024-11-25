// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";



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
export const db = getFirestore(app); // Export the Firestore instance
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
