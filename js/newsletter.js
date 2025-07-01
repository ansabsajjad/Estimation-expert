// Newsletter form submission
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(newsletterForm);
            const messageDiv = document.getElementById('newsletterMessage');
            
            fetch('newsletter.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Clear previous classes and add the appropriate one
                messageDiv.className = '';
                messageDiv.classList.add(data.status || 'error');
                messageDiv.textContent = data.message;
                messageDiv.style.display = 'block';
                
                // Reset form on success
                if (data.status === 'success') {
                    newsletterForm.reset();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                messageDiv.className = 'error';
                messageDiv.textContent = 'An error occurred. Please try again.';
                messageDiv.style.display = 'block';
            });
        });
    }
});
