// Import the Firebase functions needed
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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
const db = getFirestore(app); // Initialize Firestore

// Submit button listener
const submit = document.getElementById("submit");
submit.addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent form submission

    // Inputs
    const email = document.getElementById("email").value.trim(); // Trim input to remove extra spaces
    const username = document.getElementById("username").value.trim(); // Added username
    const password = document.getElementById("password").value.trim();

    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user information in Firestore
        await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: email,
        });

        // Send email verification
        await sendEmailVerification(user);

        // Update the user's display name
        await updateProfile(user, {
            displayName: username,
        });

        alert("Account created successfully! Please check your email to verify your account.");
        window.location.href = "../HTML/loginInvently.html"; // Redirect to login page
    } catch (error) {
        const emailError = document.getElementById("emailError");

        if (error.code === "auth/email-already-in-use") {
            // Show error message for duplicate email
            emailError.style.display = "block";
            emailError.textContent = "This email is already registered. Please log in or use a different email.";
        } else {
            console.error("Error creating account:", error);
            alert("Error: " + error.message);
        }
    }
});
