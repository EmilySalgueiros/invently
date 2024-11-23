// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app); // Firestore instance

// DOM elements
const usernameDisplay = document.getElementById("username-display");

// Check authentication state
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            // Fetch user data from Firestore
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