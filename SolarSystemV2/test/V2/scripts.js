document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('mouseover', () => {
            link.style.opacity = '0.7';
        });

        link.addEventListener('mouseout', () => {
            link.style.opacity = '1';
        });
    });
});
