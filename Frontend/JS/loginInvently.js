// Import the Firebase functions needed
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, getDocs, query, where, collection } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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
const db = getFirestore(app); // Initialize Firestore for username lookup

// Submit button listener
const submit = document.getElementById('submit');

// Submit button listener
document.getElementById('submit').addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent form submission

    // Get inputs
    let emailOrUsername = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validate inputs
    if (!emailOrUsername || !password) {
        alert("Please fill in both fields.");
        return;
    }

    try {
        // Check if input is a username
        if (!emailOrUsername.includes("@")) {
            // Query Firestore for the associated email
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", emailOrUsername));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Use the associated email for login
                emailOrUsername = querySnapshot.docs[0].data().email;
            } else {
                throw new Error("Username not found. Please check and try again.");
            }
        }

        // Sign in using the email and password
        const userCredential = await signInWithEmailAndPassword(auth, emailOrUsername, password);

        // Successful login
        alert("Logged in successfully!");
        window.location.href = "../HTML/selectInventory.html"; // Redirect to select inventory page
    } catch (error) {
        console.error("Error during login:", error);

        // Display user-friendly error messages
        if (error.code === "auth/user-not-found") {
            alert("User not found. Please check your email or username.");
        } else if (error.code === "auth/wrong-password") {
            alert("Incorrect password. Please try again.");
        } else {
            alert("Error: " + error.message);
        }
    }
});