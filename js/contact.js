/**
 * Expert Estimation - Contact Page JavaScript
 * Author: Cascade
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all contact page components
    initFaqAccordion();
    initContactForm();
});

/**
 * FAQ Accordion Functionality
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle the clicked FAQ item
            item.classList.toggle('active');
        });
    });
}

/**
 * Contact Form Validation and Submission
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            const service = document.getElementById('service').value;
            const newsletter = document.getElementById('newsletter').checked;
            
            // Validate form
            if (!validateForm(name, email, subject, message)) {
                return;
            }
            
            // Collect form data
            const formData = {
                name,
                email,
                phone,
                subject,
                message,
                service,
                newsletter
            };
            
            // Submit form (this would typically send to a server)
            submitForm(formData);
        });
    }
}

/**
 * Form Validation
 */
function validateForm(name, email, subject, message) {
    let isValid = true;
    
    // Reset previous error messages
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => element.remove());
    
    // Validate name
    if (name === '') {
        showError('name', 'Please enter your name');
        isValid = false;
    }
    
    // Validate email
    if (email === '') {
        showError('email', 'Please enter your email address');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate subject
    if (subject === '') {
        showError('subject', 'Please enter a subject');
        isValid = false;
    }
    
    // Validate message
    if (message === '') {
        showError('message', 'Please enter your message');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Show error message for a form field
 */
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#e74c3c';
    
    // Remove error styling when field is focused
    field.addEventListener('focus', function() {
        field.style.borderColor = '';
        const error = field.parentNode.querySelector('.error-message');
        if (error) {
            error.remove();
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
 * Form Submission
 * In a real implementation, this would send data to a server
 */
function submitForm(formData) {
    // Show loading state
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    // Simulate server request with timeout
    setTimeout(() => {
        // Success message (in a real implementation, this would be in the callback of an actual API request)
        showSubmissionResult(true);
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }, 1500);
    
    // For demonstration - log the data that would be sent
    console.log('Form data to submit:', formData);
}

/**
 * Show submission result message
 */
function showSubmissionResult(success) {
    // Remove any existing result message
    const existingMessage = document.querySelector('.submission-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create result message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'submission-message';
    
    if (success) {
        messageDiv.textContent = 'Thank you! Your message has been sent successfully. We will get back to you soon.';
        messageDiv.style.backgroundColor = '#d4edda';
        messageDiv.style.color = '#155724';
    } else {
        messageDiv.textContent = 'Sorry, there was a problem sending your message. Please try again later.';
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
    }
    
    messageDiv.style.padding = '15px';
    messageDiv.style.marginTop = '20px';
    messageDiv.style.borderRadius = '5px';
    
    // Add message to form
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(messageDiv, form.nextSibling);
    
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Remove message after some time
    if (success) {
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}
