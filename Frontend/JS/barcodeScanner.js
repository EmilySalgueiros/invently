// Initialize ZXing Scanner
const codeReader = new ZXing.BrowserMultiFormatReader();
const videoElement = document.getElementById('video');
const scanButton = document.getElementById('scanButton');
const stopScanButton = document.getElementById('stopScanBtn');
const scannerDiv = document.getElementById('scanner');
const resultElement = document.getElementById('result');

// Start camera scanning when Scan Product is clicked
scanButton.addEventListener('click', () => {
    scannerDiv.style.display = 'block'; // Show the camera feed
    codeReader.decodeFromVideoDevice(null, videoElement, (result, err) => {
        if (result) {
            const sku = result.text;
            resultElement.textContent = 'Scanned SKU: ' + sku; // Display SKU

            // Optionally send SKU to your Firebase function to update inventory
            fetch('https://your-cloud-function-url.com/inventory/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sku: sku })
            })
            .then(response => response.json())
            .then(data => console.log(data.message))
            .catch(error => console.error('Error:', error));
        }
    });
});

// Stop scanning when Stop Scanning is clicked
stopScanButton.addEventListener('click', () => {
    codeReader.reset();
    scannerDiv.style.display = 'none'; // Hide the camera feed
});
