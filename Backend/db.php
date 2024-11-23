<?php
$db_host = "localhost"; 
$db_username = "root"; // Place the username for the MySQL database here 
$db_pass = "";// Place the password for the MySQL database here  
$db_name = "invently";// Place the name for the MySQL database here 
$conn = new mysqli($db_host, $db_username, $db_pass,$db_name);

// Check connection
if ($conn->connect_error) {
die("Connection failed: " . $conn->connect_error);
} 
//echo "Connected successfully";
?>