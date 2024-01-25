document.addEventListener('DOMContentLoaded', () => {
    
    // Lightbox feature for the image
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.style.display = 'none';
    lightbox.style.position = 'fixed';
    lightbox.style.top = '0';
    lightbox.style.left = '0';
    lightbox.style.width = '100%';
    lightbox.style.height = '100%';
    lightbox.style.background = 'rgba(0, 0, 0, 0.8)';
    lightbox.style.zIndex = '1000';
    lightbox.style.justifyContent = 'center';
    lightbox.style.alignItems = 'center';
    document.body.appendChild(lightbox);

    const mercuryImage = document.querySelector('#mercury-image img');
    mercuryImage.addEventListener('click', () => {
        const lightboxImage = document.createElement('img');
        lightboxImage.src = mercuryImage.src;
        lightboxImage.style.maxHeight = '80%';
        lightboxImage.style.maxWidth = '80%';
        lightboxImage.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.9)';
        lightboxImage.style.borderRadius = '10px';

        while (lightbox.firstChild) {
            lightbox.removeChild(lightbox.firstChild);
        }

        lightbox.appendChild(lightboxImage);
        lightbox.style.display = 'flex';
    });

    lightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add more interactive or dynamic features as needed
});
