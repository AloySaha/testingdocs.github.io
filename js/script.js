/**
 * Main JavaScript file for the website
 * Implements smooth scrolling, form validation, and mobile navigation
 */

(function() {
    'use strict';

    // DOM Elements
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contact-form');
    const formInputs = contactForm.querySelectorAll('input, textarea');

    // Initialize the application
    function init() {
        setupMobileNavigation();
        setupSmoothScrolling();
        setupFormValidation();
        setupFormSubmission();
        setupKeyboardNavigation();
    }

    /**
     * Mobile Navigation Setup
     */
    function setupMobileNavigation() {
        navToggle.addEventListener('click', toggleMobileMenu);
        
        // Close mobile menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMobileMenu();
                navToggle.focus();
            }
        });
    }

    function toggleMobileMenu() {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
    }

    function closeMobileMenu() {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Smooth Scrolling Setup
     */
    function setupSmoothScrolling() {
        navLinks.forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });

        // Also handle CTA button
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', handleSmoothScroll);
        }
    }

    function handleSmoothScroll(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Form Validation Setup
     */
    function setupFormValidation() {
        formInputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let errorMessage = '';

        // Clear previous errors
        clearFieldError(field);

        // Required field validation
        if (!value) {
            errorMessage = `${getFieldLabel(fieldName)} is required.`;
        } else {
            // Specific validation based on field type
            switch (fieldName) {
                case 'email':
                    if (!isValidEmail(value)) {
                        errorMessage = 'Please enter a valid email address.';
                    }
                    break;
                case 'name':
                    if (value.length < 2) {
                        errorMessage = 'Name must be at least 2 characters long.';
                    }
                    break;
                case 'message':
                    if (value.length < 10) {
                        errorMessage = 'Message must be at least 10 characters long.';
                    }
                    break;
            }
        }

        if (errorMessage) {
            showFieldError(field, errorMessage);
            return false;
        }

        return true;
    }

    function showFieldError(field, message) {
        field.classList.add('error');
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    function getFieldLabel(fieldName) {
        const labels = {
            name: 'Name',
            email: 'Email',
            message: 'Message'
        };
        return labels[fieldName] || fieldName;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Form Submission Setup
     */
    function setupFormSubmission() {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showFormStatus('Please correct the errors above.', 'error');
            return;
        }

        // Show loading state
        const submitButton = contactForm.querySelector('.form-submit');
        const originalText = submitButton.textContent;
        
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            // Simulate form submission (replace with actual endpoint)
            await simulateFormSubmission();
            
            // Show success message
            showFormStatus('Thank you! Your message has been sent successfully.', 'success');
            contactForm.reset();
            
        } catch (error) {
            showFormStatus('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }

    function simulateFormSubmission() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Simulated error'));
                }
            }, 2000);
        });
    }

    function showFormStatus(message, type) {
        const statusElement = document.getElementById('form-status');
        
        statusElement.textContent = message;
        statusElement.className = `form-status ${type}`;
        
        // Hide status after 5 seconds
        setTimeout(() => {
            statusElement.className = 'form-status';
        }, 5000);
    }

    /**
     * Keyboard Navigation Setup
     */
    function setupKeyboardNavigation() {
        // Handle keyboard navigation for mobile menu
        navMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                handleTabNavigation(e);
            }
        });
    }

    function handleTabNavigation(e) {
        const focusableElements = navMenu.querySelectorAll('a[href]');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    /**
     * Intersection Observer for Animations (Progressive Enhancement)
     */
    function setupScrollAnimations() {
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, observerOptions);

            // Observe feature cards
            document.querySelectorAll('.feature-card').forEach(card => {
                observer.observe(card);
            });
        }
    }

    /**
     * Performance Optimization: Debounced Resize Handler
     */
    function setupResizeHandler() {
        let resizeTimer;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Close mobile menu on resize to desktop
                if (window.innerWidth >= 768 && navMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            }, 250);
        });
    }

    /**
     * Error Handling
     */
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
        // In production, you might want to send this to an error reporting service
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Setup additional features
    setupScrollAnimations();
    setupResizeHandler();

})();