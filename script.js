document.addEventListener('DOMContentLoaded', () => {
    const WORD_LIMIT = 200;

    // State
    const formData = {
        firstName: '',
        lastName: '',
        email: '',
        reason: '',
        message: ''
    };

    const touched = {
        firstName: false,
        lastName: false,
        email: false,
        reason: false,
        message: false
    };

    let isLoading = false;

    // Elements
    const form = document.getElementById('contactForm');
    const successState = document.getElementById('successState');
    const resetBtn = document.getElementById('resetBtn');
    
    // Inputs
    const inputs = {
        firstName: document.getElementById('firstName'),
        lastName: document.getElementById('lastName'),
        email: document.getElementById('contactEmail'),
        reason: document.getElementById('contactReason'),
        message: document.getElementById('contactMessage')
    };

    // Errors
    const errors = {
        firstName: document.getElementById('errFirstName'),
        lastName: document.getElementById('errLastName'),
        email: document.getElementById('errEmail'),
        reason: document.getElementById('errReason'),
        messageReq: document.getElementById('errMessageReq'),
        messageLimit: document.getElementById('errMessageLimit')
    };

    // Other UI
    const wordCounter = document.getElementById('wordCounter');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');

    // Logic
    function getWordCount(text) {
        return text.trim().split(/\s+/).filter(Boolean).length;
    }

    // Force CSS animation to replay each time an error appears
    function showError(el, shouldShow) {
        if (shouldShow) {
            el.classList.remove('hidden');
            // Reset animation so it replays
            el.style.animation = 'none';
            el.offsetHeight; // Force reflow
            el.style.animation = '';
        } else {
            el.classList.add('hidden');
        }
    }

    function toggleInputState(el, isError) {
        if (isError) {
            el.classList.remove('input-default');
            el.classList.add('input-error');
        } else {
            el.classList.remove('input-error');
            el.classList.add('input-default');
        }
    }

    function validate() {
        // Compute lengths & limits
        const wordCount = getWordCount(formData.message);
        const isOverLimit = wordCount > WORD_LIMIT;

        // Check individual field validity
        const isFirstNameError = touched.firstName && formData.firstName.trim() === '';
        const isLastNameError = touched.lastName && formData.lastName.trim() === '';
        const isEmailError = touched.email && formData.email.trim() === '';
        const isReasonError = touched.reason && formData.reason === '';
        const isMessageReqError = touched.message && formData.message.trim() === '';
        const isMessageLimitError = touched.message && isOverLimit;
        const isMessageError = isMessageReqError || isMessageLimitError;

        // Update Error Text UI (with animation replay fix)
        showError(errors.firstName, isFirstNameError);
        showError(errors.lastName, isLastNameError);
        showError(errors.email, isEmailError);
        showError(errors.reason, isReasonError);
        showError(errors.messageReq, isMessageReqError);
        showError(errors.messageLimit, isMessageLimitError);

        // Update Input Borders (swap classes, not stack them, to match React ternary)
        toggleInputState(inputs.firstName, isFirstNameError);
        toggleInputState(inputs.lastName, isLastNameError);
        toggleInputState(inputs.email, isEmailError);
        toggleInputState(inputs.reason, isReasonError);
        toggleInputState(inputs.message, isMessageError);

        // Update Word Counter
        if (isOverLimit) {
            wordCounter.textContent = `${wordCount - WORD_LIMIT} words over limit`;
            wordCounter.classList.add('error');
        } else {
            wordCounter.textContent = `${WORD_LIMIT - wordCount} words remaining`;
            wordCounter.classList.remove('error');
        }

        // Dropdown styling
        if (formData.reason !== '') {
            inputs.reason.classList.remove('unselected');
        } else {
            inputs.reason.classList.add('unselected');
        }

        // Form Validity
        const isFormValid = 
            formData.firstName.trim() !== '' &&
            formData.lastName.trim() !== '' &&
            formData.email.trim() !== '' &&
            formData.reason !== '' &&
            formData.message.trim() !== '' &&
            !isOverLimit;

        submitBtn.disabled = isLoading || !isFormValid;
    }

    function handleInput(e) {
        const { name, value } = e.target;
        formData[name] = value;
        validate();
    }

    function handleBlur(e) {
        const { name } = e.target;
        touched[name] = true;
        validate();
    }

    // Attach listeners
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', handleInput);
        input.addEventListener('blur', handleBlur);
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Mark all touched
        Object.keys(touched).forEach(key => touched[key] = true);
        validate();

        if (submitBtn.disabled) return;

        // Set Loading
        isLoading = true;
        validate();
        Object.values(inputs).forEach(input => input.disabled = true);
        btnText.textContent = "Sending...";
        btnLoader.classList.remove('hidden');

        // Simulate API
        setTimeout(() => {
            isLoading = false;
            
            // Reset Form Data
            Object.keys(formData).forEach(key => formData[key] = '');
            Object.keys(touched).forEach(key => touched[key] = false);
            
            // Reset UI
            Object.values(inputs).forEach(input => {
                input.value = '';
                input.disabled = false;
            });
            inputs.reason.selectedIndex = 0; // Reset dropdown to placeholder
            btnText.textContent = "Send Message";
            btnLoader.classList.add('hidden');
            validate();

            // Toggle States
            form.classList.add('hidden');
            successState.classList.remove('hidden');
        }, 2000);
    });

    // Reset button
    resetBtn.addEventListener('click', () => {
        successState.classList.add('hidden');
        form.classList.remove('hidden');
    });

    // Initial validation setup
    validate();
});
