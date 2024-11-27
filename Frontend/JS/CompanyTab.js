document.addEventListener("DOMContentLoaded", () => {
    const saveChangesBtn = document.getElementById("saveChangesBtn");

    saveChangesBtn.addEventListener("click", () => {
        // Gather values from form fields
        const companyName = document.getElementById("companyName").value;
        const chargeAmount = document.getElementById("chargeAmount").value;
        const vatCharge = document.getElementById("vatCharge").value;
        const address = document.getElementById("address").value;
        const phone = document.getElementById("phone").value;
        const country = document.getElementById("country").value;
        const notes = document.getElementById("notes").value;
        const currency = document.getElementById("currency").value;

        // Save values to local storage
        const companyInfo = {
            companyName,
            chargeAmount,
            vatCharge,
            address,
            phone,
            country,
            notes,
            currency,
        };

        localStorage.setItem("companyInfo", JSON.stringify(companyInfo));
        alert("Company information saved successfully!");
    });

    // Pre-fill form fields if data exists in local storage
    const savedInfo = JSON.parse(localStorage.getItem("companyInfo"));
    if (savedInfo) {
        document.getElementById("companyName").value = savedInfo.companyName || "";
        document.getElementById("chargeAmount").value = savedInfo.chargeAmount || "";
        document.getElementById("vatCharge").value = savedInfo.vatCharge || "";
        document.getElementById("address").value = savedInfo.address || "";
        document.getElementById("phone").value = savedInfo.phone || "";
        document.getElementById("country").value = savedInfo.country || "";
        document.getElementById("notes").value = savedInfo.notes || "";
        document.getElementById("currency").value = savedInfo.currency || "";
    }
});