 // Select the dark mode toggle switch
 const darkModeToggle = document.getElementById('dark-mode-toggle');

 // Check the current theme in localStorage
 const currentTheme = localStorage.getItem('theme');

 // If a theme is stored, apply it to the document body
 if (currentTheme) {
     document.body.classList.add(currentTheme);

     // If the stored theme is 'dark-mode', set the toggle switch to checked
     if (currentTheme === 'dark-mode') {
         darkModeToggle.checked = true;
     }
 }

 // Add an event listener to the dark mode toggle switch
 darkModeToggle.addEventListener('change', function () {
     if (darkModeToggle.checked) {
         // Enable dark mode
         document.body.classList.add('dark-mode');
         document.body.classList.remove('light-mode');
         // Save the theme in localStorage
         localStorage.setItem('theme', 'dark-mode');
     } else {
         // Enable light mode
         document.body.classList.add('light-mode');
         document.body.classList.remove('dark-mode');
         // Save the theme in localStorage
         localStorage.setItem('theme', 'light-mode');
     }
 });