document.addEventListener("DOMContentLoaded", function () {
    const darkModeButton = document.getElementById("darkModeToggle");
    const body = document.body;

    // Check local storage for dark mode preference and apply it
    if (localStorage.getItem("darkmode") === "enabled") {
        body.classList.add("darkmode");
        darkModeButton.checked = true; // Ensure the slider stays on
    } else {
        darkModeButton.checked = false; // Ensure the slider stays off
    }

    // Toggle dark mode
    darkModeButton.addEventListener("change", function () {
        if (darkModeButton.checked) {
            body.classList.add("darkmode");
            localStorage.setItem("darkmode", "enabled");
        } else {
            body.classList.remove("darkmode");
            localStorage.setItem("darkmode", "disabled");
        }
    });
});
