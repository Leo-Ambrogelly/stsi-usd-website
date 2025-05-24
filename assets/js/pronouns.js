// Syncs pronoun select with text input on share forms

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form[name="share-work"]').forEach(form => {
        const textInput = form.querySelector('input[name="Preferred pronouns"]');
        const selectInput = form.querySelector('select[data-pronouns-select]');
        if (!textInput || !selectInput) return;

        selectInput.addEventListener('change', () => {
            if (selectInput.value) {
                textInput.value = selectInput.value;
            }
        });
    });
});
