document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form[name="share-work"]').forEach(form => {
        const emailInput = form.querySelector('input[type="email"]');
        if (!emailInput) return;

        const validate = () => {
            const value = emailInput.value.trim();
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (regex.test(value)) {
                emailInput.setCustomValidity('');
            } else {
                emailInput.setCustomValidity('Please enter a valid email address.');
            }
        };

        emailInput.addEventListener('input', validate);
        form.addEventListener('submit', (e) => {
            validate();
            if (!emailInput.checkValidity()) {
                emailInput.reportValidity();
                e.preventDefault();
            }
        });
    });
});
