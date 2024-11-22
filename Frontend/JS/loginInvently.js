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
submit.addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent form submission

    // Inputs
    let emailOrUsername = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Check if the input is a username
        if (!emailOrUsername.includes("@")) {
            // Query Firestore to get the email associated with the username
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", emailOrUsername));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Extract email from the query result
                emailOrUsername = querySnapshot.docs[0].data().email;
            } else {
                throw new Error("Username not found");
            }
        }

        // Sign in with the email and password
        const userCredential = await signInWithEmailAndPassword(auth, emailOrUsername, password);
        const user = userCredential.user;

        alert("Logged in successfully!");
        window.location.href = "../HTML/dashboard.html";
    } catch (error) {
        console.error("Error logging in:", error);
        alert("Error: " + error.message + " You sure that is the right password or email? Try again.");
    }
});
