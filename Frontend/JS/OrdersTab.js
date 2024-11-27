document.addEventListener("DOMContentLoaded", () => {
    const addOrderBtn = document.getElementById("addOrderBtn");
    const addOrderModal = document.getElementById("addOrderModal");
    const closeModal = document.getElementById("closeModal");
    const cancelOrder = document.getElementById("cancelOrder");
    const createOrder = document.getElementById("createOrder");
    const ordersTableBody = document.getElementById("ordersTableBody");
    let editingRow = null; // To keep track of the row being edited

    // Function to reset modal fields
    function resetModalFields() {
        document.getElementById("orderDate").value = "";
        document.getElementById("orderTime").value = "";
        document.getElementById("customerName").value = "";
        document.getElementById("customerAddress").value = "";
        document.getElementById("customerPhone").value = "";
        document.getElementById("product").value = "";
        document.getElementById("quantity").value = "";
        document.getElementById("rate").value = "";
        document.getElementById("amount").value = "";
        document.getElementById("grossAmount").value = "";
        document.getElementById("sCharge").value = "";
        document.getElementById("vat").value = "";
        document.getElementById("discount").value = "";
        document.getElementById("netAmount").value = "";
        // Retrieve company info from local storage
        const savedInfo = JSON.parse(localStorage.getItem("companyInfo"));

        if (savedInfo) {
            // Update modal fields based on saved values
            const vatCharge = savedInfo.vatCharge || 10; // Default VAT to 10%
            const sCharge = savedInfo.chargeAmount || 13; // Default S-Charge to 13%

            document.querySelector("label[for='vat']").textContent = `VAT ${vatCharge}%:`;
            document.querySelector("label[for='sCharge']").textContent = `S-Charge ${sCharge}%:`;

            // Optionally, update the readonly inputs if needed
            document.getElementById("vat").value = vatCharge;
            document.getElementById("sCharge").value = sCharge;
        }
    }

    // Show modal for adding a new order
    addOrderBtn.addEventListener("click", () => {
        editingRow = null; // Reset editingRow to indicate a new order
        resetModalFields(); // Reset all modal fields to empty
        const now = new Date();
        document.getElementById("orderDate").value = now.toISOString().split("T")[0];
        document.getElementById("orderTime").value = now.toLocaleTimeString();
        createOrder.textContent = "Create Order"; // Set button text to "Create Order"
        addOrderModal.style.display = "flex";
    });

    // Close modal
    closeModal.addEventListener("click", () => {
        addOrderModal.style.display = "none";
    });

    cancelOrder.addEventListener("click", () => {
        addOrderModal.style.display = "none";
    });

    // Save Order (Create or Update)
    createOrder.addEventListener("click", () => {
        const customerName = document.getElementById("customerName").value;
        const customerPhone = document.getElementById("customerPhone").value;
        const orderDate = document.getElementById("orderDate").value;
        const orderTime = document.getElementById("orderTime").value;

        if (editingRow) {
            // Update the existing row
            editingRow.cells[1].textContent = customerName;
            editingRow.cells[2].textContent = customerPhone;
            editingRow.cells[3].textContent = `${orderDate} ${orderTime}`;
        } else {
            // Add new row to table
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${Math.floor(1000 + Math.random() * 9000)}</td>
                <td>${customerName}</td>
                <td>${customerPhone}</td>
                <td>${orderDate} ${orderTime}</td>
                <td>1</td>
                <td>$100</td>
                <td><span style="color:green;">Paid</span></td>
                <td>
                    <button class="action-btn edit-btn">
                        <ion-icon name="create-outline"></ion-icon>
                        Edit
                    </button>
                    <button class="action-btn delete-btn">
                        <ion-icon name="trash-outline"></ion-icon>
                        Delete
                    </button>
                    <button class="action-btn print-btn">
                        <ion-icon name="print-outline"></ion-icon>
                        Print
                    </button>
                </td>
            `;
            ordersTableBody.appendChild(row);
        }

        addOrderModal.style.display = "none";
        editingRow = null; // Reset editingRow after saving
    });

    // Event delegation for Edit, Delete, and Print buttons
    document.addEventListener("click", (e) => {
        // Edit button
        if (e.target.closest(".edit-btn")) {
            console.log("Edit button clicked");

            const row = e.target.closest("tr");
            editingRow = row; // Set the row being edited
            const customerName = row.cells[1].textContent;
            const customerPhone = row.cells[2].textContent;
            const dateTime = row.cells[3].textContent;

            addOrderModal.style.display = "flex";

            // Populate modal fields with row data
            document.getElementById("orderDate").value = dateTime.split(" ")[0];
            document.getElementById("orderTime").value = dateTime.split(" ")[1];
            document.getElementById("customerName").value = customerName;
            document.getElementById("customerPhone").value = customerPhone;

            // Change button text to "Save Changes"
            createOrder.textContent = "Save Changes";
        }

        // Delete button
        if (e.target.closest(".delete-btn")) {
            console.log("Delete button clicked");

            const row = e.target.closest("tr");
            const confirmation = confirm(`Are you sure you want to delete this order?`);
            if (confirmation) {
                row.remove();
            }
        }

        // Print button logic
        if (e.target.closest(".print-btn")) {
            console.log("Print button clicked");

            const row = e.target.closest("tr");
            const billNo = row.cells[0].textContent;
            const customerName = row.cells[1].textContent;
            const customerPhone = row.cells[2].textContent;
            const dateTime = row.cells[3].textContent;

            // Collect modal information
            const customerAddress = document.getElementById("customerAddress").value || "N/A";
            const product = document.getElementById("product").value || "N/A";
            const quantity = document.getElementById("quantity").value || "0";
            const rate = document.getElementById("rate").value || "0";
            const amount = document.getElementById("amount").value || "0";
            const grossAmount = document.getElementById("grossAmount").value || "0";
            const sCharge = document.getElementById("sCharge").value || "0";
            const vat = document.getElementById("vat").value || "0";
            const discount = document.getElementById("discount").value || "0";
            const netAmount = document.getElementById("netAmount").value || "0";

            // Format the data for printing
            const printContent = `
        Bill No: ${billNo}
        Customer Name: ${customerName}
        Customer Phone: ${customerPhone}
        Customer Address: ${customerAddress}
        Date & Time: ${dateTime}
        Product: ${product}
        Quantity: ${quantity}
        Rate: $${rate}
        Amount: $${amount}
        Gross Amount: $${grossAmount}
        S-Charge (13%): $${sCharge}
        VAT (10%): $${vat}
        Discount: $${discount}
        Net Amount: $${netAmount}
    `;

            // Open a new window or print dialog
            const printWindow = window.open("", "_blank");
            printWindow.document.write(`<pre>${printContent}</pre>`);
            printWindow.document.close();
            printWindow.print();
        }
    });
});
