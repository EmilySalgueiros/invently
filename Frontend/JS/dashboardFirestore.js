// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";



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
export const db = getFirestore(app); // Export the Firestore instance
export const auth = getAuth(app); // Export the Auth instance


// DOM elements
const usernameDisplay = document.getElementById("username-display");

// Check authentication state
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            // Fetch user data from Firestore
            console.log("User is authenticated:", user.uid);
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

addProductBtn.addEventListener("click", async () => {
    const newProduct = {
        itemCode: Math.floor(Math.random() * 1000).toString().padStart(3, "0"),
        sku: generateUniqueSKU(),
        description: "New Item",
        quantity: 10,
        threshold: 5,
        status: "In Stock",
        location: "A01",
    };

    try {
        await setDoc(doc(db, "inventory", newProduct.sku), newProduct);
        alert("Product added successfully!");
        loadProducts(); // Reload the product table
    } catch (error) {
        console.error("Error adding product:", error);
    }
});
async function loadProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, "inventory"));
        inventoryTable.innerHTML = ""; // Clear the table

        let inStockCount = 0;
        let lowStockCount = 0;

        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const row = `
                <tr>
                    <td>${product.itemCode}</td>
                    <td>${product.sku}</td>
                    <td>${product.description}</td>
                    <td>${product.quantity}</td>
                    <td>${product.threshold}</td>
                    <td>${product.quantity <= product.threshold ? "Low Stock" : "In Stock"}</td>
                    <td>${product.location}</td>
                    <td>
                        <button class="edit-btn" data-sku="${product.sku}">Edit</button>
                        <button class="delete-btn" data-sku="${product.sku}">Delete</button>
                    </td>
                </tr>`;
            inventoryTable.insertAdjacentHTML("beforeend", row);

            // Count stock status
            if (product.quantity <= product.threshold) {
                lowStockCount++;
            } else {
                inStockCount++;
            }
        });

        // Attach event listeners for Edit and Delete buttons
        document.querySelectorAll(".edit-btn").forEach((btn) =>
            btn.addEventListener("click", () => editProduct(btn.dataset.sku))
        );
        document.querySelectorAll(".delete-btn").forEach((btn) =>
            btn.addEventListener("click", () => deleteProduct(btn.dataset.sku))
        );

        // Render pie chart
        renderStockPieChart(inStockCount, lowStockCount);
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

function renderStockPieChart(inStock, lowStock) {
    const ctx = document.getElementById("stockPieChart").getContext("2d");

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["In Stock", "Low Stock"],
            datasets: [
                {
                    data: [inStock, lowStock],
                    backgroundColor: ["#36A2EB", "#FF6384"],
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
                title: {
                    display: true,
                    text: "Stock Status Distribution",
                },
            },
        },
    });
}

// Load products and chart on page load
document.addEventListener("DOMContentLoaded", loadProducts);


// Load products on page load
document.addEventListener("DOMContentLoaded", loadProducts);
async function editProduct(sku) {
    const productRef = doc(db, "inventory", sku);
    const productSnapshot = await getDoc(productRef);

    if (productSnapshot.exists()) {
        const product = productSnapshot.data();
        document.getElementById("editItemCode").value = product.itemCode;
        document.getElementById("editSKU").value = product.sku;
        document.getElementById("editDescription").value = product.description;
        document.getElementById("editQuantity").value = product.quantity;
        document.getElementById("editThreshold").value = product.threshold;
        document.getElementById("editLocation").value = product.location;

        editInventoryModal.classList.add("active");
    }
}

editInventoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const sku = document.getElementById("editSKU").value;
    try {
        await updateDoc(doc(db, "inventory", sku), {
            description: document.getElementById("editDescription").value,
            quantity: parseInt(document.getElementById("editQuantity").value),
            threshold: parseInt(document.getElementById("editThreshold").value),
            location: document.getElementById("editLocation").value,
        });
        alert("Product updated successfully!");
        loadProducts(); // Reload the product table
        editInventoryModal.classList.remove("active");
    } catch (error) {
        console.error("Error updating product:", error);
    }
});
async function deleteProduct(sku) {
    try {
        await deleteDoc(doc(db, "inventory", sku));
        alert("Product deleted successfully!");
        loadProducts(); // Reload the product table
    } catch (error) {
        console.error("Error deleting product:", error);
    }
}
saveStockChangesBtn.addEventListener("click", async () => {
    try {
        for (const [binId, stock] of Object.entries(binStocks)) {
            await updateDoc(doc(db, "bins", binId), { stock });
        }
        alert("Stock changes saved successfully!");
    } catch (error) {
        console.error("Error saving stock changes:", error);
    }
});

