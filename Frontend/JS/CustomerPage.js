// Import Firebase Firestore
import { getFirestore, collection, getDocs, addDoc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

let currentCustomerId = null; // Track whether you're editing an existing customer
const modalTitle = document.getElementById("modalTitle"); // Get the modal title element


/*============================================================================================*/
/*============================================================================================*/
/*============================================================================================*/ 




// Now we will handle the firebase configuration
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
const db = getFirestore(app);


/*============================================================================================*/
/*============================================================================================*/ 
/*============================================================================================*/ 


// Now we start with the JS of th customer side and its modal

// DOM elements
const customerTableBody = document.getElementById("customerTableBody");
const addCustomerBtn = document.getElementById("addCustomerBtn");
const modal = document.getElementById("newCustomerModal");
const closeModal = document.getElementById("closeModal");
const cancelCustomer = document.getElementById("cancelCustomer");
const customerIdField = document.getElementById("customerId");
const saveCustomerBtn = document.getElementById("saveCustomer");
const nextToAddress = document.getElementById("nextToAddress");
const customerDetailsForm = document.getElementById("customerDetailsForm");
const addressDetailsForm = document.getElementById("addressDetailsForm");
const backToCustomerInfo = document.getElementById("backToCustomerInfo");
const addCustomerModal = document.getElementById("addCustomerModal");



// Function to generate a random customer ID
function generateCustomerId() {
    return "CUST-" + Math.floor(1000 + Math.random() * 9000);
}

// Open the modal and set a random Customer ID
document.addEventListener("DOMContentLoaded", () => {
    const addCustomerBtn = document.getElementById("addCustomerBtn");
    if (addCustomerBtn) {
        addCustomerBtn.addEventListener("click", () => {
            modal.style.display = "flex";
            customerIdField.value = generateCustomerId();
            console.log("Add Customer button clicked!");
        });
    } else {
        console.error("addCustomerBtn element not found.");
    }
});



// Open the modal and set a random Customer ID
document.addEventListener("DOMContentLoaded", () => {
    const addCustomerBtn = document.getElementById("addCustomerBtn");
    const closeModal = document.getElementById("closeModal");
    const cancelCustomer = document.getElementById("cancelCustomer");
    if (addCustomerBtn) {
        addCustomerBtn.addEventListener("click", () => {
            clearForm();
            modalTitle.textContent = "New Customer"; // Set the title for adding a new customer
            customerIdField.value = generateCustomerId(); // Generate a new customer ID
            document.getElementById("customerId").value = generateCustomerId(); // Generate new ID

            console.log("Add Customer button clicked!");
        });
    } else {
        console.error("addCustomerBtn element not found.");
    }


    if (closeModal) {
        // Close the modal
        closeModal.addEventListener("click", () => {
            modal.style.display = "none";
            modalTitle.textContent = "New Customer"; // Reset the title
            console.log("Close Modal button clicked!");
        });
    } else {
        console.error("closeModal element not found.");
    }

    if (cancelCustomer) {
        cancelCustomer.addEventListener("click", () => {
            modal.style.display = "none";
            modalTitle.textContent = "New Customer"; // Reset the title
            console.log("Cancel button clicked!");
        });
    } else {
        console.error("cancelCustomer element not found.");
    }

    // This the address 

    if (nextToAddress) {
        nextToAddress.addEventListener("click", () => {
            customerDetailsForm.style.display = "none";
            addressDetailsForm.style.display = "block";
        });
    } else {
        console.error("nextToAddress button not found.");
    }


    //This to show the customers

    if (backToCustomerInfo) {
        backToCustomerInfo.addEventListener("click", () => {
            addressDetailsForm.style.display = "none";
            customerDetailsForm.style.display = "block";
        });
    } else {
        console.error("backToCustomerInfo button not found.");
    }

});


cancelCustomer.addEventListener("click", () => {
    modal.style.display = "none";
});

// Clear the form
function clearForm() {
    document.getElementById("customerDetailsForm").reset();
    document.getElementById("addressDetailsForm").reset();
    addressDetailsForm.style.display = "none";
    customerDetailsForm.style.display = "block";
}


//This is to calculate the receivables

const calculateReceivables = async () => {
    try {
        const invoicesSnapshot = await getDocs(collection(db, "invoices"));
        const receivables = {};

        invoicesSnapshot.forEach((doc) => {
            const invoice = doc.data();
            const { customerId, totalAmount } = invoice;

            if (customerId) {
                if (!receivables[customerId]) {
                    receivables[customerId] = 0;
                }
                receivables[customerId] += parseFloat(totalAmount || 0);
            }
        });

        console.log("Calculated receivables:", receivables);
        return receivables;
    } catch (error) {
        console.error("Error calculating receivables:", error);
        return {};
    }
};

const updateCustomerReceivables = async () => {
    try {
        const receivables = await calculateReceivables();
        const customerCollection = collection(db, "customers");

        for (const [customerId, totalReceivable] of Object.entries(receivables)) {
            const customerRef = doc(customerCollection, customerId);

            await setDoc(customerRef, { receivables: `$${totalReceivable.toFixed(2)}` }, { merge: true });
            console.log(`Updated receivables for customer ${customerId}: $${totalReceivable.toFixed(2)}`);
        }

        console.log("All receivables updated successfully.");
    } catch (error) {
        console.error("Error updating customer receivables:", error);
    }
};




// Until here to calculate the receivables 

// Validation function
function validateInputs() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation regex
    const firstName = document.getElementById("firstName").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!firstName) {
        alert("First Name is required.");
        return false;
    }

    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    return true; // All validations passed
}

// Save a new customer to Firestore
saveCustomerBtn.addEventListener("click", async () => {
    const customerType = document.getElementById("customerType").value;
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const companyName = document.getElementById("companyName").value.trim();
    const email = document.getElementById("email").value.trim();
    const customerId = customerIdField.value;
    const phone = document.getElementById("phone").value.trim();
    const paymentTerms = document.getElementById("paymentTerms").value;

    // Billing Address
    const billingCountry = document.getElementById("billingCountry").value.trim();
    const billingAddress = document.getElementById("billingAddress").value.trim();
    const billingCity = document.getElementById("billingCity").value.trim();
    const billingState = document.getElementById("billingState").value.trim();
    const billingZip = document.getElementById("billingZip").value.trim();
    const billingPhone = document.getElementById("billingPhone").value.trim();
    const billingFax = document.getElementById("billingFax").value.trim();

    // Shipping Address
    const shippingCountry = document.getElementById("shippingCountry").value.trim();
    const shippingAddress = document.getElementById("shippingAddress").value.trim();
    const shippingCity = document.getElementById("shippingCity").value.trim();
    const shippingState = document.getElementById("shippingState").value.trim();
    const shippingZip = document.getElementById("shippingZip").value.trim();
    const shippingPhone = document.getElementById("shippingPhone").value.trim();
    const shippingFax = document.getElementById("shippingFax").value.trim();

    if (!validateInputs()) return;

    try {
        const customerData = {
            customerType,
            name: `${firstName} ${lastName}`.trim(),
            companyName: companyName || "",
            email,
            customerId,
            workPhone: phone || "",
            receivables: "$0.00",
            paymentTerms,
            billingAddress: {
                country: billingCountry,
                address: billingAddress,
                city: billingCity,
                state: billingState,
                zip: billingZip,
                phone: billingPhone,
                fax: billingFax,
            },
            shippingAddress: {
                country: shippingCountry,
                address: shippingAddress,
                city: shippingCity,
                state: shippingState,
                zip: shippingZip,
                phone: shippingPhone,
                fax: shippingFax,
            },
        };

        if (currentCustomerId) {
            // Update existing customer
            const customerRef = doc(db, "customers", currentCustomerId);
            await setDoc(customerRef, customerData, { merge: true });
            console.log("Customer updated:", customerData);
        } else {
            // Add new customer
            const docRef = await addDoc(collection(db, "customers"), customerData);
            console.log("New customer added:", customerData);
            currentCustomerId = docRef.id; // Update the global state with the new customer's ID
        }

        // Refresh the customer list
        await loadCustomers();

        // Reset form and close modal
        modal.style.display = "none";
        clearForm();
        currentCustomerId = null; // Reset the global state
    } catch (error) {
        console.error("Error saving customer:", error);
    }
});

// Fetch customers from Firestore and populate the table
async function loadCustomers() {
    const customerCollection = collection(db, "customers");
    const querySnapshot = await getDocs(customerCollection);

    // Clear the table before adding rows
    customerTableBody.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const customer = doc.data();
        addCustomerToTable(customer, doc.id); // Pass the document ID
    });
}

// Add a customer row to the table
function addCustomerToTable(customer, docId) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${customer.name || ""}</td>
        <td>${customer.companyName || ""}</td>
        <td>${customer.email || ""}</td>
        <td>${customer.workPhone || ""}</td>
        <td>${customer.receivables || "$0.00"}</td>
        <td>
            <button class="edit-btn" data-id="${docId}">Edit</button>
            <button class="delete-btn" data-id="${docId}">Delete</button>
        </td>
    `;
    customerTableBody.appendChild(row);

    // Attach event listeners for edit and delete
    row.querySelector(".edit-btn").addEventListener("click", async () => {
        const id = docId;
        editCustomer(id);
    });

    row.querySelector(".delete-btn").addEventListener("click", async () => {
        const id = docId;

        if (confirm("Are you sure you want to delete this customer?")) {
            await deleteCustomer(id);
            await updateCustomerReceivables();
            await loadCustomers(); // Refresh the table to remove deleted customer
            row.remove(); // Remove the row from the table
        }
    });
}


async function editCustomer(docId) {
    try {
        const customerRef = doc(db, "customers", docId);
        const customerDoc = await getDoc(customerRef);

        if (customerDoc.exists()) {
            const customer = customerDoc.data();

            // Pre-fill the modal fields with customer data
            document.getElementById("customerType").value = customer.customerType || "Business";
            document.getElementById("firstName").value = customer.name.split(" ")[0] || "";
            document.getElementById("lastName").value = customer.name.split(" ")[1] || "";
            document.getElementById("companyName").value = customer.companyName || "";
            document.getElementById("email").value = customer.email || "";
            document.getElementById("customerId").value = customer.customerId || "";
            document.getElementById("phone").value = customer.workPhone || "";
            document.getElementById("paymentTerms").value = customer.paymentTerms || "";

            // Pre-fill billing address
            document.getElementById("billingCountry").value = customer.billingAddress?.country || "";
            document.getElementById("billingAddress").value = customer.billingAddress?.address || "";
            document.getElementById("billingCity").value = customer.billingAddress?.city || "";
            document.getElementById("billingState").value = customer.billingAddress?.state || "";
            document.getElementById("billingZip").value = customer.billingAddress?.zip || "";
            document.getElementById("billingPhone").value = customer.billingAddress?.phone || "";
            document.getElementById("billingFax").value = customer.billingAddress?.fax || "";

            // Pre-fill shipping address
            document.getElementById("shippingCountry").value = customer.shippingAddress?.country || "";
            document.getElementById("shippingAddress").value = customer.shippingAddress?.address || "";
            document.getElementById("shippingCity").value = customer.shippingAddress?.city || "";
            document.getElementById("shippingState").value = customer.shippingAddress?.state || "";
            document.getElementById("shippingZip").value = customer.shippingAddress?.zip || "";
            document.getElementById("shippingPhone").value = customer.shippingAddress?.phone || "";
            document.getElementById("shippingFax").value = customer.shippingAddress?.fax || "";

            
            // Update the modal title for editing
            modalTitle.textContent = "Customer";

            // Show the modal
            modal.style.display = "flex";

            // Set global state for editing
            currentCustomerId = docId;
        }
    } catch (error) {
        console.error("Error editing customer:", error);
    }
}

// Function to delete a customer from Firestore
async function deleteCustomer(docId) {
    try {
        await deleteDoc(doc(db, "customers", docId));
        console.log("Customer deleted successfully!");
    } catch (error) {
        console.error("Error deleting customer: ", error);
    }
}

// Load customers on page load
document.addEventListener("DOMContentLoaded", loadCustomers);

export const auth = getAuth(app); // Export the Auth instance



// Function to save a new inventory item to Firestore
async function saveNewItemToFirestore(newItem) {
    const inventoryRef = doc(db, "inventory", "mhi1OrJnP6xSZAvgpZ64");

    try {
        // Check if the document exists
        const docSnapshot = await getDoc(inventoryRef);

        if (docSnapshot.exists()) {
            // Document exists, update the array field
            await setDoc(
                inventoryRef,
                { items: arrayUnion(newItem) },
                { merge: true } // Merge with existing data
            );
            console.log("New item successfully added to Firestore:", newItem);
        } else {
            // Document doesn't exist, create it with the first item
            await setDoc(inventoryRef, { items: [newItem] });
            console.log("Document created and new item added to Firestore:", newItem);
        }
    } catch (error) {
        console.error("Error adding new item to Firestore:", error);
    }
}


async function saveCustomerChanges(docId) {
    const customerType = document.getElementById("customerType").value;
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const companyName = document.getElementById("companyName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const paymentTerms = document.getElementById("paymentTerms").value;

    // Billing Address
    const billingCountry = document.getElementById("billingCountry").value.trim();
    const billingAddress = document.getElementById("billingAddress").value.trim();
    const billingCity = document.getElementById("billingCity").value.trim();
    const billingState = document.getElementById("billingState").value.trim();
    const billingZip = document.getElementById("billingZip").value.trim();
    const billingPhone = document.getElementById("billingPhone").value.trim();
    const billingFax = document.getElementById("billingFax").value.trim();

    // Shipping Address
    const shippingCountry = document.getElementById("shippingCountry").value.trim();
    const shippingAddress = document.getElementById("shippingAddress").value.trim();
    const shippingCity = document.getElementById("shippingCity").value.trim();
    const shippingState = document.getElementById("shippingState").value.trim();
    const shippingZip = document.getElementById("shippingZip").value.trim();
    const shippingPhone = document.getElementById("shippingPhone").value.trim();
    const shippingFax = document.getElementById("shippingFax").value.trim();

    try {
        const updatedCustomer = {
            customerType,
            name: `${firstName} ${lastName}`,
            companyName,
            email,
            workPhone: phone,
            paymentTerms,
            billingAddress: {
                country: billingCountry,
                address: billingAddress,
                city: billingCity,
                state: billingState,
                zip: billingZip,
                phone: billingPhone,
                fax: billingFax,
            },
            shippingAddress: {
                country: shippingCountry,
                address: shippingAddress,
                city: shippingCity,
                state: shippingState,
                zip: shippingZip,
                phone: shippingPhone,
                fax: shippingFax,
            },
        };

        const customerRef = doc(db, "customers", docId);
        await setDoc(customerRef, updatedCustomer, { merge: true });

        console.log("Customer updated:", updatedCustomer); // Debugging log
        await loadCustomers(); // Refresh table data
        console.log("Customer list reloaded");

        // Show a success alert after saving changes
        alert("Customer details updated successfully!");
    } catch (error) {
        console.error("Error saving changes: ", error);
    }


const updatedRow = document.querySelector(`[data-id="${docId}"]`);
updatedRow.innerHTML = `
    <td>${updatedCustomer.name}</td>
    <td>${updatedCustomer.companyName}</td>
    <td>${updatedCustomer.email}</td>
    <td>${updatedCustomer.workPhone}</td>
    <td>${updatedCustomer.receivables || "$0.00"}</td>
    <td>
        <button class="edit-btn" data-id="${docId}">Edit</button>
        <button class="delete-btn" data-id="${docId}">Delete</button>
    </td>
`;

}

//===========================================================================================================
//===========================================================================================================
// This is the part of the manage invoices

// JavaScript to handle opening and closing the modal

let currentInvoiceId = null; // Global variable to track the invoice being edited

document.addEventListener("DOMContentLoaded", async () => {
    const addInvoiceBtn = document.getElementById("addInvoiceBtn");
    const addInvoiceModal2 = document.getElementById("addInvoiceModal2");
    const closeInvoiceModal2 = document.getElementById("closeInvoiceModal2");
    const cancelInvoiceModal2 = document.getElementById("cancelInvoiceModal2");
    const companySelect = document.getElementById("companySelect2"); // Dropdown element
    const billToTextarea = document.getElementById("billTo2"); // "Bill To" textarea
    const saveInvoiceBtn = document.getElementById("saveInvoiceBtn");
    const invoiceTableBody = document.getElementById("InvoiceTableBody");
    const addRowBtn = document.getElementById("addRowBtn"); // Button for adding rows
    const itemsTable = document.getElementById("invoiceItemsBody"); // Table body for items

    loadInvoices();


    // Function to add a new row to the items table
    const addNewItemRow = () => {
        const newRow = document.createElement("tr");

        newRow.innerHTML = `
            <td><input type="text" placeholder="Item Name"></td>
            <td><input type="number" placeholder="Qty"></td>
            <td><input type="text" placeholder="Description"></td>
            <td><input type="number" placeholder="Rate"></td>
            <td><input type="number" placeholder="Amount" readonly></td>
        `;

        // Automatically calculate amount when quantity or rate changes
        const quantityInput = newRow.querySelector("td:nth-child(2) input");
        const rateInput = newRow.querySelector("td:nth-child(4) input");
        const amountInput = newRow.querySelector("td:nth-child(5) input");

        const calculateAmount = () => {
            const quantity = parseFloat(quantityInput.value) || 0;
            const rate = parseFloat(rateInput.value) || 0;
            amountInput.value = (quantity * rate).toFixed(2);
        };

        quantityInput.addEventListener("input", calculateAmount);
        rateInput.addEventListener("input", calculateAmount);

        itemsTable.appendChild(newRow);
    };

    // Attach the event listener to the "Add Row" button
    addRowBtn.addEventListener("click", addNewItemRow);


    // Now this is the function that will generate a random invoice Number ID

    function generateInvoiceId() {
        const timestamp = Date.now().toString(36); // Encode current timestamp
        const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase(); // Random string
        return `INV-${timestamp}-${randomPart}`;
    }


    // Add a new row to the items table
    function addNewItemRow2() {
        const itemsTable = document.getElementById("invoiceItemsBody");
        const newRow = document.createElement("tr");

        newRow.innerHTML = `
        <td><input type="text" placeholder="Item Name"></td>
        <td><input type="number" placeholder="Qty"></td>
        <td><input type="text" placeholder="Description"></td>
        <td><input type="number" placeholder="Rate"></td>
        <td><input type="number" placeholder="Amount" readonly></td>
    `;

        // Automatically calculate amount when quantity or rate changes
        const quantityInput = newRow.querySelector("td:nth-child(2) input");
        const rateInput = newRow.querySelector("td:nth-child(4) input");
        const amountInput = newRow.querySelector("td:nth-child(5) input");

        const calculateAmount = () => {
            const quantity = parseFloat(quantityInput.value) || 0;
            const rate = parseFloat(rateInput.value) || 0;
            amountInput.value = (quantity * rate).toFixed(2);
        };

        quantityInput.addEventListener("input", calculateAmount);
        rateInput.addEventListener("input", calculateAmount);

        itemsTable.appendChild(newRow);
    }


    // Function to reset the invoice modal
    // Function to reset the invoice modal
    function resetInvoiceModal() {
        const invoiceIdField = document.getElementById("invoiceId");
        if (invoiceIdField) {
            // Generate and set the Invoice ID in the modal
            const newInvoiceId = generateInvoiceId();
            invoiceIdField.value = newInvoiceId;
        }

        // Reset other fields
        const companySelect = document.getElementById("companySelect2");
        if (companySelect) companySelect.value = "";

        const billToField = document.getElementById("billTo2");
        if (billToField) billToField.value = "";

        const invoiceDateField = document.getElementById("invoiceDate");
        if (invoiceDateField) invoiceDateField.value = new Date().toISOString().split("T")[0];

        const totalAmountField = document.getElementById("totalAmount");
        if (totalAmountField) totalAmountField.value = "0.00";

        const balanceDueField = document.getElementById("balanceDue");
        if (balanceDueField) balanceDueField.value = "0.00";

        const itemsTable = document.getElementById("invoiceItemsBody");
        if (itemsTable) itemsTable.innerHTML = ""; // Clear all rows

        addNewItemRow(); // Add one default row
    }



    // Populate company dropdown
    // Populate company dropdown
    async function populateCompanyDropdown() {
        companySelect.innerHTML = '<option value="" disabled selected>Select Company</option>'; // Reset dropdown

        try {
            const customerCollection = collection(db, "customers"); // Reference to the Firestore collection
            const querySnapshot = await getDocs(customerCollection); // Fetch customers

            querySnapshot.forEach((doc) => {
                const customer = doc.data();
                const option = document.createElement("option");
                option.value = doc.id; // Use document ID as the value
                option.textContent = `${customer.name} (${customer.companyName})`; // Display name and company
                companySelect.appendChild(option);
            });

            console.log("Company dropdown populated successfully.");
        } catch (error) {
            console.error("Error populating company dropdown:", error);
        }
    }


    // This function will let the table appear again and again

    // Function to fetch and display all invoices
    async function loadInvoices() {
        const invoiceCollection = collection(db, "invoices"); // Reference the 'invoices' collection
        const querySnapshot = await getDocs(invoiceCollection); // Fetch all documents in the collection

        invoiceTableBody.innerHTML = ""; // Clear the table body before populating

        querySnapshot.forEach((doc) => {
            const invoice = doc.data();
            addInvoiceToTable(invoice, doc.id); // Populate each invoice row
        });

        console.log("Invoices loaded successfully.");
    }


    // This is to add the button to edit the information of the respective invoice

    async function editInvoice(docId) {
        try {
            // Fetch the invoice document from Firestore
            const invoiceRef = doc(db, "invoices", docId);
            const invoiceDoc = await getDoc(invoiceRef);

            if (invoiceDoc.exists()) {
                const invoice = invoiceDoc.data();

                // Populate the modal fields with the invoice data
                document.getElementById("invoiceId").value = invoice.invoiceId || "";
                document.getElementById("invoiceDate").value = invoice.date || "";
                document.getElementById("totalAmount").value = invoice.totalAmount?.toFixed(2) || "0.00";
                document.getElementById("balanceDue").value = invoice.balanceDue?.toFixed(2) || "0.00";
                document.getElementById("billTo2").value = invoice.billTo || "";

                // Set the global variable to the current invoice ID
                currentInvoiceId = docId;

                // Populate the company dropdown and set the correct value
                await populateCompanyDropdown(); // Ensure dropdown options are loaded first
                const companySelect = document.getElementById("companySelect2");
                if (companySelect) {
                    Array.from(companySelect.options).forEach((option) => {
                        if (option.value === invoice.customerId || option.textContent.includes(invoice.companyName)) {
                            option.selected = true; // Match by customerId or companyName
                        }
                    });
                }

                // Populate the items table
                const itemsTable = document.getElementById("invoiceItemsBody");
                itemsTable.innerHTML = ""; // Clear any existing rows

                if (invoice.items && Array.isArray(invoice.items)) {
                    invoice.items.forEach((item) => {
                        const newRow = document.createElement("tr");
                        newRow.innerHTML = `
                        <td><input type="text" value="${item.itemName || ""}" placeholder="Item Name"></td>
                        <td><input type="number" value="${item.quantity || 0}" placeholder="Qty"></td>
                        <td><input type="text" value="${item.description || ""}" placeholder="Description"></td>
                        <td><input type="number" value="${item.rate || 0}" placeholder="Rate"></td>
                        <td><input type="number" value="${(item.amount || 0).toFixed(2)}" placeholder="Amount" readonly></td>
                    `;
                        itemsTable.appendChild(newRow);
                    });
                }

                // Open the modal
                const addInvoiceModal2 = document.getElementById("addInvoiceModal2");
                addInvoiceModal2.style.display = "flex";

                console.log("Invoice loaded into modal for editing:", invoice);
            } else {
                console.error("Invoice not found!");
            }
        } catch (error) {
            console.error("Error editing invoice:", error);
        }
    }





    // Update "Bill To" textarea when a company is selected
    companySelect.addEventListener("change", async () => {
        const selectedCompanyId = companySelect.value; // Get the selected company's document ID

        if (selectedCompanyId) {
            try {
                const customerRef = doc(db, "customers", selectedCompanyId); // Reference to the selected customer
                const customerDoc = await getDoc(customerRef);

                if (customerDoc.exists()) {
                    const customer = customerDoc.data();
                    billToTextarea.value = `${customer.name}\n${customer.companyName}\n${customer.billingAddress.address}, ${customer.billingAddress.city}, ${customer.billingAddress.state}, ${customer.billingAddress.zip}`;
                } else {
                    billToTextarea.value = "Selected company details not found.";
                }
            } catch (error) {
                console.error("Error fetching selected company details:", error);
                billToTextarea.value = "Error fetching company details.";
            }
        }
    });

    // This is the part that will let us add the information of the invoice
    // to the firebase

    // Save Invoice and Add to Firestore and Table
    // Save Invoice and Add to Firestore and Table
    saveInvoiceBtn.addEventListener("click", async () => {
        const invoiceId = document.getElementById("invoiceId").value; // Use the invoice ID from the modal
        const companySelect = document.getElementById("companySelect2");
        const companyName = companySelect.options[companySelect.selectedIndex]?.text || "";
        const selectedCompanyId = companySelect.value;
        const invoiceDate = document.getElementById("invoiceDate").value;
        const billTo = document.getElementById("billTo2").value;

        // Get all items from the table
        const itemsTable = document.getElementById("invoiceItemsBody");
        const items = Array.from(itemsTable.querySelectorAll("tr")).map((row) => {
            const itemName = row.querySelector("td:nth-child(1) input")?.value || "";
            const quantity = parseFloat(row.querySelector("td:nth-child(2) input")?.value) || 0;
            const description = row.querySelector("td:nth-child(3) input")?.value || "";
            const rate = parseFloat(row.querySelector("td:nth-child(4) input")?.value) || 0;
            const amount = quantity * rate;
            return { itemName, quantity, description, rate, amount };
        });

        // Calculate totals
        const totalAmount = items.reduce((total, item) => total + item.amount, 0);
        const balanceDue = totalAmount; // Assuming the full amount is due initially

        // Validate Inputs
        if (!selectedCompanyId) {
            alert("Please select a company.");
            return;
        }

        try {
            const invoiceData = {
                invoiceId, // Include the Invoice ID from the modal
                companyName,
                customerId: selectedCompanyId,
                date: invoiceDate,
                billTo,
                items,
                totalAmount,
                balanceDue,
                status: "Pending", // Default status
            };

            if (currentInvoiceId) {
                // Update the existing invoice
                const invoiceRef = doc(db, "invoices", currentInvoiceId);
                await setDoc(invoiceRef, invoiceData, { merge: true });

                console.log("Invoice updated:", invoiceData);

                // Update the table row
                updateInvoiceTableRow(currentInvoiceId, invoiceData);
            } else {
                // Create a new invoice
                const docRef = await addDoc(collection(db, "invoices"), invoiceData);
                console.log("Invoice added to Firestore with ID:", docRef.id);

                // Add a new row to the table
                addInvoiceToTable(invoiceData, docRef.id);
            }

            await updateCustomerReceivables();


            // Reset the current invoice ID
            currentInvoiceId = null;

            // Close the modal
            addInvoiceModal2.style.display = "none";

            alert("Invoice saved successfully!");
        } catch (error) {
            console.error("Error saving invoice:", error);
            alert("Failed to save the invoice. Please try again.");
        }
    });








    // This function will work as an update for the table

    function updateInvoiceTableRow(docId, invoice) {
        const rows = document.querySelectorAll(`#InvoiceTableBody tr`);
        rows.forEach((row) => {
            if (row.querySelector(".edit-btn")?.getAttribute("data-id") === docId) {
                row.innerHTML = `
                <td>${invoice.invoiceId}</td>
                <td>${invoice.companyName}</td>
                <td>${invoice.totalAmount.toFixed(2)}</td>
                <td>${invoice.date}</td>
                <td>${invoice.status}</td>
                <td>
                    <button class="edit-btn" data-id="${docId}">Edit</button>
                    <button class="delete-btn" data-id="${docId}">Delete</button>
                    <button class="status-btn" data-id="${docId}">${invoice.status === "Paid" ? "Pending" : "Paid"}</button>

                </td>
            `;

                // Reattach event listeners for Edit and Delete
                row.querySelector(".edit-btn").addEventListener("click", () => editInvoice(docId));
                row.querySelector(".delete-btn").addEventListener("click", async () => {
                    if (confirm("Are you sure you want to delete this invoice?")) {
                        await deleteDoc(doc(db, "invoices", id));
                        await updateCustomerReceivables();
                        await loadCustomers(); // Refresh the customer table
                        row.remove(); // Remove the row from the table
                    }
                });






                // Attach status button functionality
                row.querySelector(".status-btn").addEventListener("click", async (e) => {
                    const statusButton = e.target;
                    const newStatus = invoice.status === "Paid" ? "Pending" : "Paid";

                    try {
                        // Update Firestore with the new status
                        const invoiceRef = doc(db, "invoices", docId);
                        await setDoc(invoiceRef, { status: newStatus }, { merge: true });

                        // Update the row UI
                        invoice.status = newStatus; // Update the local variable
                        row.querySelector("td:nth-child(5)").textContent = newStatus; // Update the "Status" column
                        statusButton.textContent = newStatus === "Paid" ? "Pending" : "Paid"; // Update button text

                        console.log(`Invoice ${docId} status updated to ${newStatus}`);
                    } catch (error) {
                        console.error("Error updating status:", error);
                    }
                });










            }
        });
    }






    // Add Invoice Row to Table
    function addInvoiceToTable(invoice, docId) {
        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${invoice.invoiceId || ""}</td>
        <td>${invoice.companyName || ""}</td>
        <td>${invoice.totalAmount ? invoice.totalAmount.toFixed(2) : "0.00"}</td>
        <td>${invoice.date || ""}</td>
        <td>${invoice.status || "Pending"}</td>
        <td>
            <button class="edit-btn" data-id="${docId}">Edit</button>
            <button class="delete-btn" data-id="${docId}">Delete</button>
            <button class="status-btn" data-id="${docId}">${invoice.status === "Paid" ? "Pending" : "Paid"}</button>
        </td>
    `;

        invoiceTableBody.appendChild(row);

        // Attach event listeners to the buttons
        row.querySelector(".edit-btn").addEventListener("click", () => editInvoice(docId));
        row.querySelector(".delete-btn").addEventListener("click", async () => {
            if (confirm("Are you sure you want to delete this invoice?")) {
                await deleteDoc(doc(db, "invoices", docId));
                row.remove();
                console.log("Invoice deleted:", docId);
            }
        });
        // Attach event listener to the status button
        row.querySelector(".status-btn").addEventListener("click", async (e) => {
            const statusButton = e.target;
            const newStatus = invoice.status === "Paid" ? "Pending" : "Paid";

            try {
                // Update Firestore with the new status
                const invoiceRef = doc(db, "invoices", docId);
                await setDoc(invoiceRef, { status: newStatus }, { merge: true });

                // Update the row UI
                invoice.status = newStatus; // Update the local variable
                row.querySelector("td:nth-child(5)").textContent = newStatus; // Update the "Status" column
                statusButton.textContent = newStatus === "Paid" ? "Pending" : "Paid"; // Update button text

                console.log(`Invoice ${docId} status updated to ${newStatus}`);
            } catch (error) {
                console.error("Error updating status:", error);
            }
        });
    }


    if (addInvoiceBtn && addInvoiceModal2 && closeInvoiceModal2 && cancelInvoiceModal2) {
        // Open modal and populate dropdown
        addInvoiceBtn.addEventListener("click", async () => {
            resetInvoiceModal(); // Reset all fields and content in the modal
            await populateCompanyDropdown(); // Populate the dropdown with customer data
            addInvoiceModal2.style.display = "flex"; // Open the modal
            console.log("Add Invoice button clicked, modal opened."); // Debugging
        });

        // Close modal
        closeInvoiceModal2.addEventListener("click", () => {
            currentInvoiceId = null; // Reset the global variable
            addInvoiceModal2.style.display = "none";
            console.log("Close button clicked, modal closed."); // Debugging
        });

        // Cancel button
        cancelInvoiceModal2.addEventListener("click", () => {
            currentInvoiceId = null; // Reset the global variable
            addInvoiceModal2.style.display = "none";
            console.log("Cancel button clicked, modal closed."); // Debugging
        });

        // Close modal when clicking outside the modal
        window.addEventListener("click", (event) => {
            if (event.target === addInvoiceModal2) {
                addInvoiceModal2.style.display = "none";
                console.log("Clicked outside modal, modal closed."); // Debugging
            }
        });
    } else {
        console.error("One or more modal elements (addInvoiceBtn, addInvoiceModal2, closeInvoiceModal2, cancelInvoiceModal2) are missing.");
    }
});
