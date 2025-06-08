document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form[name="share-work"]').forEach((form) => {
        form.setAttribute('novalidate', '');
        const requiredFields = form.querySelectorAll('input[required], textarea[required]');

        requiredFields.forEach((field) => {
            const errorEl = document.createElement('p');
            errorEl.className = 'form-error hidden';
            field.insertAdjacentElement('afterend', errorEl);

            const validateField = () => {
                let message = '';
                const value = field.value.trim();

                if (field.type === 'email') {
                    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!regex.test(value)) {
                        message = 'Please enter a valid email address.';
                    }
                }

                if (!value) {
                    message = 'This field is required.';
                }

                field.setCustomValidity(message);
                errorEl.textContent = message;
                errorEl.classList.toggle('hidden', !message);
                field.classList.toggle('invalid-input', !!message);
            };

            field.addEventListener('input', validateField);
            field.addEventListener('blur', validateField);
        });

        form.addEventListener('submit', (e) => {
            let isValid = true;
            requiredFields.forEach((field) => {
                field.dispatchEvent(new Event('blur'));
                if (!field.checkValidity()) {
                    isValid = false;
                }
            });
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
});
