// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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


// Select the navbar icons container
const navbarIcons = document.querySelector(".navbar-icons");

// Select dynamic content container (optional for homepage)
const bannerContent = document.querySelector(".bannerContent");

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Auth state changed:", user); // Debugging
        // Update Navbar for Logged-In Users
        navbarIcons.innerHTML = `
            <a href="dashboard.html" class="navbar-link">Dashboard</a>
            <a href="#" id="logout" class="navbar-link">Log Out</a>
        `;

        // Add Logout Functionality
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

        // Update Homepage Content for Logged-In Users
        if (bannerContent) {
            bannerContent.innerHTML = `
                <h1 class="bannerHeader">Welcome Back!</h1>
                <p class="bannerSubheader">Your inventory dashboard awaits.</p>
            `;
        }
    } else {
        // Update Navbar for Logged-Out Users
        navbarIcons.innerHTML = `
            <a href="signinInvently.html" class="navbar-link">Sign Up</a>
            <a href="loginInvently.html" class="navbar-link">Log In</a>
        `;

        // Update Homepage Content for Logged-Out Users
        if (bannerContent) {
            bannerContent.innerHTML = `
                <h1 class="bannerHeader">Invently</h1>
                <p class="bannerSubheader">Inventory Management System</p>
                <p class="bannerTagline">Track your goods throughout your entire supply chain, from purchasing to production
                to end sales</p>
            `;
        }
    }
});