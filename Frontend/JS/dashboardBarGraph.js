//First we start integrating firebase 
// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs, onSnapshot, getDoc, doc, where, addDoc, deleteDoc, updateDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";





// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZstZmYQ2HOdKX639ayM6L_OoGd64ozqs",
    authDomain: "inventlylogin.firebaseapp.com",
    projectId: "inventlylogin",
    storageBucket: "inventlylogin.appspot.com",
    messagingSenderId: "120631227540",
    appId: "1:120631227540:web:526487d0dcbcdd61c63081"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firebase Initialized:", db); // Add this


const fetchInvoicesAndOrdersData = async () => {
    try {
        // Fetch invoices
        const invoicesSnapshot = await getDocs(collection(db, "invoices"));
        let totalInvoicesAmount = 0;

        invoicesSnapshot.forEach((doc) => {
            const invoice = doc.data();
            totalInvoicesAmount += parseFloat(invoice.totalAmount || 0); // Sum all invoice amounts
        });

        // Fetch orders
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        let totalOrderAmount = 0;

        ordersSnapshot.forEach((doc) => {
            const order = doc.data();
            totalOrderAmount += parseFloat(order.totalAmount || 0); // Sum all order amounts
        });

        // Calculate total profit
        const totalProfit = totalInvoicesAmount - totalOrderAmount;

        return { totalInvoicesAmount, totalOrderAmount, totalProfit };
    } catch (error) {
        console.error("Error fetching invoices and orders:", error);
        return { totalInvoicesAmount: 0, totalOrderAmount: 0, totalProfit: 0 };
    }
};


const renderBarChart = async () => {
    const { totalInvoicesAmount, totalOrderAmount, totalProfit } = await fetchInvoicesAndOrdersData();

    const ctx = document.getElementById("invoicesVsOrdersChart").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Invoices", "Profit", "Orders"],
            datasets: [
                {
                    label: "Invoices Total ($)",
                    data: [totalInvoicesAmount, 0, 0],
                    backgroundColor: "#6488eb",
                    borderWidth: 1,
                },
                {
                    label: "Profit ($)",
                    data: [0, totalProfit, 0],
                    backgroundColor: "#4CAF50",
                    borderWidth: 1,
                },
                {
                    label: "Orders Total ($)",
                    data: [0, 0, totalOrderAmount],
                    backgroundColor: "#e69e56",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                    labels: {
                        font: {
                            size: 14,
                        },
                        color: "#333",
                    },
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            return `$${context.raw.toFixed(2)}`;
                        },
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Amount ($)",
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: "Category",
                    },
                    barPercentage: 0.8, // Adjust bar width (0.0 to 1.0; higher is thicker)
                    categoryPercentage: 0.8, // Adjust category width (space between bars)
                },
            },
        },
    });
};



// Call the render function
renderBarChart();



