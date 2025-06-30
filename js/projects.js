/**
 * Xpert Estimation - Projects Page JavaScript
 * Author: Cascade
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initProjectFilters();
    initProjectModals();
    initStatsCounter();
});

/**
 * Initialize project filtering functionality
 */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    if (card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
}

/**
 * Initialize project modals
 */
function initProjectModals() {
    const projectLinks = document.querySelectorAll('.view-project');
    const modals = document.querySelectorAll('.project-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Open modal when clicking on project link
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('href');
            const modal = document.querySelector(modalId);
            
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });
    
    // Close modal when clicking on close button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.project-modal');
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Enable scrolling
        });
    });
    
    // Close modal when clicking outside of modal content
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = ''; // Enable scrolling
            }
        });
    });
    
    // Initialize gallery thumbnails
    const galleryThumbs = document.querySelectorAll('.gallery-thumbs .thumb');
    galleryThumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const mainImage = this.closest('.modal-gallery').querySelector('.main-image');
            const thumbSrc = this.getAttribute('src');
            const thumbAlt = this.getAttribute('alt');
            
            mainImage.setAttribute('src', thumbSrc);
            mainImage.setAttribute('alt', thumbAlt);
        });
    });
}

/**
 * Initialize stats counter animation
 */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const countTo = parseInt(target.getAttribute('data-count'));
                    
                    // Start counting animation
                    animateCounter(target, 0, countTo, 2000);
                    
                    // Unobserve after animation starts
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        
        // Observe all stat numbers
        stats.forEach(stat => {
            observer.observe(stat);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        stats.forEach(stat => {
            const countTo = parseInt(stat.getAttribute('data-count'));
            animateCounter(stat, 0, countTo, 2000);
        });
    }
}

/**
 * Animate counter from start to end value
 * @param {HTMLElement} element - The element to update
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} duration - Animation duration in milliseconds
 */
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        element.textContent = currentValue;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = end; // Ensure we end at the exact value
        }
    };
    
    window.requestAnimationFrame(step);
}
