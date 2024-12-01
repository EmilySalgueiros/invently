// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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
const auth = getAuth(app); // Initialize Auth

// Function to handle logout
function handleLogout() {
    signOut(auth)
        .then(() => {
            console.log("User signed out successfully.");
            // Redirect to homepage after logout
            window.location.href = "InventlyHomepage.html";
        })
        .catch((error) => {
            console.error("Error signing out:", error.message);
        });
}

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is logged in:", user);

        // Add event listener to the Sign Out button in the navbar
        const navbarSignOutButton = document.getElementById("logout");
        if (navbarSignOutButton) {
            navbarSignOutButton.addEventListener("click", (event) => {
                event.preventDefault();
                handleLogout();
            });
        }

        // Add event listener to the Sign Out button on the dashboard
        const dashboardSignOutButton = document.getElementById("dashboardSignOut");
        if (dashboardSignOutButton) {
            dashboardSignOutButton.addEventListener("click", (event) => {
                event.preventDefault();
                handleLogout();
            });
        }
    } else {
        console.log("No user is logged in.");
        // Redirect to login page if no user is authenticated
        if (window.location.pathname.includes("dashboard.html")) {
            window.location.href = "loginInvently.html";
        }
    }
});
