document.addEventListener("DOMContentLoaded", () => {
    const vendorIdField = document.getElementById("vendorId");
    const vendorTableSection = document.getElementById("vendorTableSection");
    const vendorItemsBody = document.getElementById("vendorItemsBody");
    const vendorsTableBody = document.getElementById("vendorsTableBody"); // Correct table for outside modal

    const addOrderModal = document.getElementById("addOrderModal");
    const addVendorModal = document.getElementById("addVendorModal");
    const saveOrderBtn = document.getElementById("saveOrderBtn");
    const saveVendorBtn = document.getElementById("saveVendorBtn");
    const cancelVendorBtn = document.getElementById("cancelVendorBtn");
    const cancelOrderBtn = document.getElementById("cancelOrderBtn");
    const addRowBtn = document.getElementById("addRowBtn");
    const orderItemsBody = document.getElementById("orderItemsBody");
    const totalAmount = document.getElementById("totalAmount");
    const balanceDue = document.getElementById("balanceDue");

    // Function to generate a random Vendor ID
    function generateVendorId() {
        const randomNum = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit number
        const timestamp = Date.now().toString().slice(-4); // Use the last 4 digits of the timestamp
        return `VID-${randomNum}-${timestamp}`; // Combine them into a unique ID
    }

    // Show Add Vendor Modal and Set Random Vendor ID
    document.getElementById("addVendorBtn").addEventListener("click", () => {
        vendorIdField.value = generateVendorId(); // Assign the generated ID to the field
        addVendorModal.style.display = "flex"; // Show the modal
    });

    // Save Vendor Logic
    saveVendorBtn.addEventListener("click", () => {
        // Collect form data
        const vendorId = vendorIdField.value;
        const firstName = document.getElementById("vendorFirstNameInput").value;
        const lastName = document.getElementById("vendorLastNameInput").value;
        const companyName = document.getElementById("vendorCompanyNameInput").value;
        const phone = document.getElementById("vendorPhoneInput").value;
        const address = document.getElementById("vendorAddressInput").value;
        const email = document.getElementById("vendorEmailInput").value;
        const notes = document.getElementById("vendorNotesInput").value;

        // Validate inputs (optional)
        if (!firstName || !lastName || !companyName || !phone) {
            alert("Please fill in the required fields.");
            return;
        }

        // Add new row to the table
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${vendorId}</td>
            <td>${firstName}</td>
            <td>${lastName}</td>
            <td>${companyName}</td>
            <td>${phone}</td>
            <td>${address}</td>
            <td>${email}</td>
            <td>${notes}</td>
        `;
        vendorItemsBody.appendChild(row);

        // Update relevant fields outside the modal (e.g., in Orders Table)
        const vendorstable = document.getElementById("vendors-table");
        const vendorInfoRow = document.createElement("tr");

        vendorInfoRow.innerHTML = `
        <td>${vendorId}</td>
        <td>${firstName} ${lastName}</td>
        <td>${phone}</td>
        <td><input type="text" placeholder="Date"></td>
        <td><input type="number" placeholder="Total Products"></td>
        <td><input type="number" placeholder="Total Amount"></td>
        <td><select>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
            </select></td>
        <td><button class="delete-row-btn">Delete</button></td>
    `;

        vendorstable.appendChild(vendorInfoRow);

        // Show the vendor table section in the modal
        vendorstable.style.display = "block";

        // Reset form fields
        document.getElementById("vendorForm").reset();
        vendorIdField.value = generateVendorId(); // Generate a new ID for the next vendor

        // Close the modal
        addVendorModal.style.display = "none";
    });







    

    // Show modal for manage orders 
    document.getElementById("addOrderBtn").addEventListener("click", () => {
        resetOrderModal();
        addOrderModal.style.display = "flex";
    });


    // Show modal for manage vendors 
    document.getElementById("addVendorBtn").addEventListener("click", () => {
        resetOrderModal2();
        addVendorModal.style.display = "flex";
    });


    // Hide modal for manage vendors  
    cancelVendorBtn.addEventListener("click", () => {
        addVendorModal.style.display = "none";
    });

    // Hide modal for manage orders 
    cancelOrderBtn.addEventListener("click", () => {
        addOrderModal.style.display = "none";
    });



    // Add new row for items
    addRowBtn.addEventListener("click", () => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="text" placeholder="Item Name"></td>
            <td><input type="number" placeholder="Qty"></td>
            <td><input type="text" placeholder="Description"></td>
            <td><input type="number" placeholder="Rate"></td>
            <td><input type="number" placeholder="Amount" readonly></td>
            <td><button class="delete-row-btn">Delete</button></td>
        `;
        orderItemsBody.appendChild(row);
    });

    // Calculate totals when inputs change
    orderItemsBody.addEventListener("input", (e) => {
        if (e.target.closest("tr")) {
            const row = e.target.closest("tr");
            const qty = row.querySelector('input[placeholder="Qty"]').value || 0;
            const rate = row.querySelector('input[placeholder="Rate"]').value || 0;
            const amountField = row.querySelector('input[placeholder="Amount"]');
            amountField.value = (qty * rate).toFixed(2);

            calculateTotals();
        }
    });

    // Handle delete row
    orderItemsBody.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-row-btn")) {
            const row = e.target.closest("tr");
            row.remove();
            calculateTotals(); // Recalculate totals after deletion
        }
    });

    // Reset modal for the manage vendors fields
    function resetOrderModal2() {
        document.querySelectorAll('input[placeholder="VendorID"]').forEach(input => input.value = "");
        document.querySelectorAll('input[placeholder="First Name"]').forEach(input => input.value = "");
        document.querySelectorAll('input[placeholder="Last Name"]').forEach(input => input.value = "");
        document.querySelectorAll('input[placeholder="Company Name"]').forEach(input => input.value = "");
        document.querySelectorAll('input[placeholder="Phone"]').forEach(input => input.value = "");
        document.querySelectorAll('input[placeholder="Address"]').forEach(input => input.value = "");
        document.querySelectorAll('input[placeholder="Email"]').forEach(input => input.value = "");
        document.querySelectorAll('input[placeholder="Notes"]').forEach(input => input.value = "");
    }


    // Reset modal for the manage orders fields
    function resetOrderModal() {
        document.getElementById("companySelect").value = "";
        document.getElementById("orderToCompany").value = "";
        document.querySelectorAll('input[placeholder="Item Name"]').forEach(input => input.value = "");
        document.querySelectorAll('input[placeholder="Qty"]').forEach(input => input.value = "");
        document.querySelectorAll('input[placeholder="Description"]').forEach(input => input.value = "");
        document.querySelectorAll('input[placeholder="Rate"]').forEach(input => input.value = "");
        document.querySelectorAll('input[placeholder="Amount"]').forEach(input => input.value = "");
        totalAmount.value = "0.00";
        balanceDue.value = "0.00";
    }

    // Calculate totals
    function calculateTotals() {
        let total = 0;
        document.querySelectorAll('input[placeholder="Amount"]').forEach(input => {
            total += parseFloat(input.value || 0);
        });

        totalAmount.value = total.toFixed(2);
        balanceDue.value = total.toFixed(2);
    }
});
