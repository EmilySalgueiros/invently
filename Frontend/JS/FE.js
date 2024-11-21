// Import Firebase functions
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Initialize Firebase Auth
const auth = getAuth();

// Select the navbar icons container
const navbarIcons = document.querySelector(".navbar-icons");

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in
        navbarIcons.innerHTML = `
            <a href="dashboard.html" class="navbar-link">Dashboard</a>
            <a href="#" id="logout" class="navbar-link">Log Out</a>
        `;

        // Add logout functionality
        document.getElementById("logout").addEventListener("click", () => {
            signOut(auth)
                .then(() => {
                    // Redirect to homepage after logout
                    window.location.href = "FE.html";
                })
                .catch((error) => {
                    console.error("Error signing out:", error.message);
                });
        });
    } else {
        // User is logged out
        navbarIcons.innerHTML = `
            <a href="signinInvently.html" class="navbar-link">Sign Up</a>
            <a href="loginInvently.html" class="navbar-link">Log In</a>
        `;
    }
});