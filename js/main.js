/**
 * Expert Estimation - Main JavaScript
 * Author: Cascade
 * Version: 2.0 - Component-based Architecture
 * 
 * This file contains the main JavaScript functionality for the Expert Estimation website.
 * It follows a modular pattern and works with the component-based architecture.
 */

// Main App Module
const App = (function() {
    // Private variables
    let scrollPosition = 0;
    
    // Initialize the application
    function init() {
        // Initialize components
        initStickyHeader();
        initMobileMenu();
        initTestimonialSlider();
        initBackToTop();
        initSmoothScroll();
        initAnimations();
        initLazyLoading();
        initFormValidation();
        
        // Listen for window resize events
        window.addEventListener('resize', handleResize);
        
        // Listen for scroll events
        window.addEventListener('scroll', handleScroll);
        
        console.log('Expert Estimation - Initialized');
    }
    
    // Handle window resize
    function handleResize() {
        // Add any resize-specific logic here
    }
    
    // Handle scroll events
    function handleScroll() {
        scrollPosition = window.scrollY;
        // Add any scroll-specific logic here
    }
    
    // Public API
    return {
        init: init
    };
})();

// Initialize the app when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.init);
} else {
    App.init();
}

/**
 * Sticky Header Component
 * Handles the sticky behavior of the header on scroll
 */
function initStickyHeader() {
    const header = document.querySelector('header');
    if (!header) return;
    
    const scrollThreshold = 100;
    let lastScroll = 0;
    const headerHeight = header.offsetHeight;
    
    // Add padding to body to prevent content jump
    document.body.style.paddingTop = `${headerHeight}px`;
    
    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class based on scroll position
        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
            
            // Scroll down - hide header
            if (currentScroll > lastScroll && currentScroll > headerHeight) {
                header.style.transform = `translateY(-${headerHeight}px)`;
            } 
            // Scroll up - show header
            else if (currentScroll < lastScroll) {
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.classList.remove('scrolled');
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
}

/**
 * Mobile Menu Component
 * Handles the mobile navigation menu functionality
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.main-nav');
    
    if (!menuBtn || !navMenu) return;

    const toggleMenu = (e) => {
        if (e) e.preventDefault();
        menuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Toggle aria-expanded for accessibility
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle aria-hidden on the navigation
        navMenu.setAttribute('aria-hidden', isExpanded);
        
        // Set focus to first menu item when opening
        if (!isExpanded) {
            const firstLink = navMenu.querySelector('a');
            if (firstLink) firstLink.focus();
        }
    };
    
    // Initialize ARIA attributes
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Toggle navigation menu');
    menuBtn.setAttribute('aria-controls', 'main-navigation');
    navMenu.setAttribute('id', 'main-navigation');
    navMenu.setAttribute('aria-hidden', 'true');
    
    // Toggle menu on button click
    menuBtn.addEventListener('click', toggleMenu);
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.main-nav') && !e.target.closest('.mobile-menu-btn')) {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        }
    });
    
    // Handle keyboard navigation
    const menuItems = navMenu.querySelectorAll('a');
    const firstItem = menuItems[0];
    const lastItem = menuItems[menuItems.length - 1];
    
    navMenu.addEventListener('keydown', (e) => {
        if (!e.target.matches('a')) return;
        
        const isTabPressed = e.key === 'Tab';
        const isEscapePressed = e.key === 'Escape';
        
        if (!isTabPressed && !isEscapePressed) return;
        
        if (isEscapePressed) {
            e.preventDefault();
            toggleMenu();
            menuBtn.focus();
            return;
        }
        
        if (e.shiftKey) {
            if (document.activeElement === firstItem) {
                e.preventDefault();
                lastItem.focus();
            }
        } else {
            if (document.activeElement === lastItem) {
                e.preventDefault();
                firstItem.focus();
            }
        }
    });
}

/**
 * Testimonial Slider Component
 * Creates an accessible and touch-friendly testimonial carousel
 */
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll('.testimonial-item'));
    const dotsContainer = slider.querySelector('.testimonial-dots') || document.createElement('div');
    const prevBtn = slider.querySelector('.testimonial-prev');
    const nextBtn = slider.querySelector('.testimonial-next');
    
    if (slides.length <= 1) return;

    // Initialize dots container if it doesn't exist
    if (!slider.contains(dotsContainer)) {
        dotsContainer.className = 'testimonial-dots';
        slider.appendChild(dotsContainer);
    }

    let currentIndex = 0;
    let isAnimating = false;
    const slideCount = slides.length;
    const autoplayInterval = 8000; // 8 seconds per slide
    let autoplayTimer;
    let touchStartX = 0;
    let touchEndX = 0;

    // Create dots if they don't exist
    if (dotsContainer && !dotsContainer.querySelector('.dot')) {
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to testimonial ${index + 1} of ${slideCount}`);
            dot.setAttribute('aria-controls', `testimonial-${index}`);
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
            
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                goToSlide(index);
            });
            
            dotsContainer.appendChild(dot);
        });
    }

    const dots = Array.from(dotsContainer.querySelectorAll('.dot'));

    // Initialize slider
    updateSlider();
    startAutoplay();

    // Event Listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prevSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextSlide();
        });
    }

    // Touch events for mobile
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        pauseAutoplay();
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    }, { passive: true });

    // Keyboard navigation
    slider.setAttribute('tabindex', '0');
    slider.setAttribute('role', 'region');
    slider.setAttribute('aria-roledescription', 'carousel');
    slider.setAttribute('aria-label', 'Testimonials');
    
    slider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'Home') {
            e.preventDefault();
            goToSlide(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            goToSlide(slideCount - 1);
        }
    });

    // Pause autoplay when interacting with the slider
    slider.addEventListener('mouseenter', pauseAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    slider.addEventListener('focusin', pauseAutoplay);
    slider.addEventListener('focusout', startAutoplay);

    // Go to specific slide
    function goToSlide(index) {
        if (isAnimating || index === currentIndex) return;
        
        isAnimating = true;
        currentIndex = (index + slideCount) % slideCount;
        updateSlider();
        
        // Reset animation flag after transition ends
        setTimeout(() => {
            isAnimating = false;
        }, 500); // Match this with your CSS transition duration
    }

    // Go to next slide
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    // Go to previous slide
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // Update slider UI
    function updateSlider() {
        // Update slides
        slides.forEach((slide, index) => {
            const position = (index - currentIndex) * 100;
            slide.style.transform = `translateX(${position}%)`;
            slide.setAttribute('aria-hidden', index !== currentIndex);
            slide.setAttribute('tabindex', index === currentIndex ? '0' : '-1');
            
            // Update slide role for screen readers
            slide.setAttribute('role', 'tabpanel');
            slide.setAttribute('id', `testimonial-${index}`);
            slide.setAttribute('aria-roledescription', 'slide');
            slide.setAttribute('aria-label', `${index + 1} of ${slideCount}`);
        });

        // Update dots
        if (dots.length) {
            dots.forEach((dot, index) => {
                const isActive = index === currentIndex;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-selected', isActive);
                dot.setAttribute('tabindex', isActive ? '0' : '-1');
            });
        }

        // Update ARIA live region for screen readers
        let liveRegion = slider.querySelector('.sr-only');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.className = 'sr-only';
            liveRegion.setAttribute('aria-live', 'polite');
            slider.appendChild(liveRegion);
        }
        liveRegion.textContent = `Displaying testimonial ${currentIndex + 1} of ${slideCount}: ${slides[currentIndex].textContent.trim().substring(0, 100)}...`;
    }

    // Handle swipe gestures
    function handleSwipe() {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Start autoplay
    function startAutoplay() {
        pauseAutoplay();
        autoplayTimer = setInterval(() => {
            nextSlide();
        }, autoplayInterval);
    }

    // Pause autoplay
    function pauseAutoplay() {
        clearInterval(autoplayTimer);
    }
}

/**
 * Back to Top Component
 * Shows/hides the back to top button based on scroll position
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;

    const scrollThreshold = 300;
    let isVisible = false;
    let scrollTimeout;
    
    // Set initial ARIA attributes
    backToTopButton.setAttribute('aria-label', 'Back to top');
    backToTopButton.setAttribute('aria-hidden', 'true');
    
    // Throttle scroll events for better performance
    const handleScroll = () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = window.requestAnimationFrame(() => {
            const shouldBeVisible = window.pageYOffset > scrollThreshold;
            
            // Only update if state changed
            if (shouldBeVisible !== isVisible) {
                isVisible = shouldBeVisible;
                
                if (isVisible) {
                    backToTopButton.classList.add('show');
                    backToTopButton.setAttribute('aria-hidden', 'false');
                    
                    // Focus management for keyboard users
                    backToTopButton.addEventListener('focus', () => {
                        backToTopButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    });
                } else {
                    backToTopButton.classList.remove('show');
                    backToTopButton.setAttribute('aria-hidden', 'true');
                }
            }
        });
    };
    
    // Smooth scroll to top
    const scrollToTop = (e) => {
        if (e) {
            e.preventDefault();
        }
        
        // Use smooth scrolling if supported
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // Fallback for browsers that don't support smooth scrolling
            const scrollStep = -window.scrollY / (500 / 15);
            
            const scrollInterval = setInterval(() => {
                if (window.scrollY > 0) {
                    window.scrollBy(0, scrollStep);
                } else {
                    clearInterval(scrollInterval);
                }
            }, 15);
        }
        
        // Move focus to the top of the page for keyboard users
        const focusTarget = document.querySelector('header') || document.body;
        focusTarget.setAttribute('tabindex', '-1');
        focusTarget.focus();
        
        // Clean up
        setTimeout(() => {
            focusTarget.removeAttribute('tabindex');
        }, 1000);
    };
    
    // Event Listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    backToTopButton.addEventListener('click', scrollToTop);
    
    // Keyboard support
    backToTopButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToTop();
        }
    });
    
    // Initial check
    handleScroll();
}

/**
 * Smooth Scroll for Anchor Links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Skip if it's the back to top button (already handled)
        if (this.getAttribute('id') === 'back-to-top') return;
        
        const targetId = this.getAttribute('href');
        
        // Skip if it's just "#" or empty
        if (targetId === '#' || !targetId) return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            e.preventDefault();
            
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/**
 * Form Validation
 * Simple validation for newsletter form
 */
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (isValidEmail(email)) {
            // Here you would typically send the form data to a server
            // For now, just show a success message
            alert('Thank you for subscribing to our newsletter!');
            emailInput.value = '';
        } else {
            alert('Please enter a valid email address.');
        }
    });
}

/**
 * Email Validation Helper
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Smooth Scroll Initialization
 * Handles smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Skip if it's a carousel control or has a special class
        if (anchor.classList.contains('carousel-control') || 
            anchor.getAttribute('role') === 'button') {
            return;
        }
        
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // If it's just a #, prevent default and return
            if (targetId === '#') {
                e.preventDefault();
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
                
                // Focus the target element for keyboard users
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                
                // Clean up
                setTimeout(() => {
                    targetElement.removeAttribute('tabindex');
                }, 1000);
            }
        });
    });
}

/**
 * Animations Initialization
 * Handles scroll-based animations using Intersection Observer
 */
function initAnimations() {
    // Skip if IntersectionObserver is not supported
    if (!('IntersectionObserver' in window)) return;
    
    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Unobserve after animation is triggered to improve performance
                observer.unobserve(entry.target);
            }
        });
    };
    
    const observer = new IntersectionObserver(animateOnScroll, {
        threshold: 0.1,
        rootMargin: '0px 0px -20% 0px' // Start animation when element is 20% from viewport bottom
    });
    
    // Observe all elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(element => {
        observer.observe(element);
    });
}

/**
 * Lazy Loading Initialization
 * Handles lazy loading of images and iframes
 */
function initLazyLoading() {
    // Skip if IntersectionObserver is not supported
    if (!('IntersectionObserver' in window)) return;
    
    const lazyLoad = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lazyElement = entry.target;
                
                // Handle images
                if (lazyElement.tagName === 'IMG') {
                    lazyElement.src = lazyElement.dataset.src || '';
                    lazyElement.srcset = lazyElement.dataset.srcset || '';
                } 
                // Handle iframes
                else if (lazyElement.tagName === 'IFRAME') {
                    lazyElement.src = lazyElement.dataset.src;
                }
                
                // Handle background images
                if (lazyElement.dataset.bg) {
                    lazyElement.style.backgroundImage = `url(${lazyElement.dataset.bg})`;
                }
                
                // Remove the lazy class
                lazyElement.classList.remove('lazy');
                
                // Stop observing this element
                observer.unobserve(lazyElement);
                
                // Dispatch a custom event when the image is loaded
                if (lazyElement.complete) {
                    lazyElement.dispatchEvent(new Event('load'));
                } else {
                    lazyElement.addEventListener('load', function onLoad() {
                        lazyElement.dispatchEvent(new Event('lazyloaded'));
                        lazyElement.removeEventListener('load', onLoad);
                    });
                }
            }
        });
    };
    
    const lazyObserver = new IntersectionObserver(lazyLoad, {
        rootMargin: '200px 0px', // Start loading when within 200px of viewport
        threshold: 0.01
    });
    
    // Observe all lazy-loaded elements
    document.querySelectorAll('.lazy, [data-src], [data-bg]').forEach(element => {
        lazyObserver.observe(element);
    });
}

/**
 * Form Validation Initialization
 * Handles form validation for all forms with the 'needs-validation' class
 */
function initFormValidation() {
    // Fetch all forms that need validation
    const forms = document.querySelectorAll('.needs-validation');
    
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
        
        // Add custom validation for specific input types
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Add input event listeners for real-time validation
            input.addEventListener('input', () => {
                validateInput(input);
            });
            
            // Add blur event for additional validation
            input.addEventListener('blur', () => {
                validateInput(input);
            });
            
            // Add custom validation for email fields
            if (input.type === 'email') {
                input.addEventListener('change', () => {
                    if (input.value && !isValidEmail(input.value)) {
                        input.setCustomValidity('Please enter a valid email address');
                    } else {
                        input.setCustomValidity('');
                    }
                });
            }
        });
    });
    
    // Helper function to validate individual inputs
    function validateInput(input) {
        const isValid = input.checkValidity();
        const errorMessage = input.parentElement.querySelector('.invalid-feedback');
        
        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            if (errorMessage) {
                errorMessage.style.display = 'block';
            }
        }
        
        return isValid;
    }
}

/**
 * Debounce Function
 * Limits the rate at which a function can fire
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Throttle Function
 * Ensures a function is only called at most once in a specified time period
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
