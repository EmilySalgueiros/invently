//First we start integrating firebase 
// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs, onSnapshot, getDoc, doc, where, addDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
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


const fetchInventoryData = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "inventory"));
        const inventory = querySnapshot.docs.map(doc => doc.data());

        // Categorize stock levels
        const stockCategories = {
            inStock: 0, // Green
            lowStock: 0, // Yellow
            outOfStock: 0, // Red
        };

        inventory.forEach(item => {
            if (item.quantity === 0) {
                stockCategories.outOfStock++;
            } else if (item.quantity > item.threshold) {
                stockCategories.inStock++;
            } else {
                stockCategories.lowStock++;
            }
        });

        return stockCategories;
    } catch (error) {
        console.error("Error fetching inventory data:", error);
    }
};

const renderStockPieChart = async () => {
    const stockData = await fetchInventoryData();

    const ctx = document.getElementById("stockPieChart").getContext("2d");

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["In Stock", "Low Stock", "Out of Stock"],
            datasets: [{
                data: [
                    stockData.inStock,
                    stockData.lowStock,
                    stockData.outOfStock
                ],
                backgroundColor: ["#57bb74", "#e69e56", "#dd5555"],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top"
                },
                tooltip: {
                    callbacks: {
                        label: (tooltipItem) => {
                            const total = stockData.inStock + stockData.lowStock + stockData.outOfStock;
                            const percentage = ((tooltipItem.raw / total) * 100).toFixed(2);
                            return `${tooltipItem.label}: ${tooltipItem.raw} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
};

// Call the function to render the chart
renderStockPieChart();
