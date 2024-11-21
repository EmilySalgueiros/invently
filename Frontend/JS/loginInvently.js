// Import the Firebase functions needed
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZstZmYQ2HOdKX639ayM6L_OoGd64ozqs",
    authDomain: "inventlylogin.firebaseapp.com",
    projectId: "inventlylogin",
    storageBucket: "inventlylogin.appspot.com", // Fixed typo here
    messagingSenderId: "120631227540",
    appId: "1:120631227540:web:526487d0dcbcdd61c63081"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Auth

// Submit button listener
const submit = document.getElementById('submit');
submit.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission

    // Inputs
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Create user
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Success: User created
            const user = userCredential.user;
            window.location.href = "../HTML/dashboard.html";
            console.log("User details:", user); // Optional debug info
        })
        .catch((error) => {
            // Handle errors
            const errorMessage = error.message;
            alert("Error: " + errorMessage);
            console.error("Error details:", error); // Optional debug info
        });
});