// Select all elements with the "revealable" class
const revealables = document.querySelectorAll('.revealable');

function revealOnScroll() {
    const triggerPoint = window.innerHeight / 1.2; // Adjust for earlier reveal

    revealables.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < triggerPoint) {
            element.classList.add('active'); // Add the 'active' class when in viewport
        } else {
            element.classList.remove('active'); // Remove the 'active' class when out of viewport
        }
    });
}

// Attach the scroll event listener
window.addEventListener('scroll', revealOnScroll);

// Initial call to reveal elements already in view
revealOnScroll();
