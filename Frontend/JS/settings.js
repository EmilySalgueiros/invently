document.addEventListener("DOMContentLoaded", function () {
    const darkModeButton = document.getElementById("darkModeToggle");
    const body = document.body;

    // Check local storage for dark mode preference
    if (localStorage.getItem("darkmode") === "enabled") {
        body.classList.add("darkmode");
    }

    // Toggle dark mode
    darkModeButton.addEventListener("click", function () {
        if (body.classList.contains("darkmode")) {
            body.classList.remove("darkmode");
            localStorage.setItem("darkmode", "disabled");
        } else {
            body.classList.add("darkmode");
            localStorage.setItem("darkmode", "enabled");
        }
    });
});