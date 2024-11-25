// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
    // Select all tiles
    const tiles = document.querySelectorAll(".inventory-card");

    // Add event listeners to each tile
    tiles.forEach((tile) => {
        tile.addEventListener("click", () => {
            // Get the text content of the clicked tile
            const tileText = tile.textContent.trim();

            // Perform an action based on the tile's text or another property
            if (tileText === "Inventory 1") {
                console.log("Redirecting to Inventory 1...");
                window.location.href = "../HTML/dashboard.html";
            } else if (tileText === "Create New Inventory") {
                console.log("Redirecting to Create New Inventory...");
                window.location.href = "../HTML/setupInventory.html"; // Change to your desired page
            } else {
                console.log("Unknown tile clicked:", tileText);
            }
        });
    });
});
