document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form[name="share-work"]').forEach(form => {
        const select = form.querySelector('#pronouns-select');
        const other = form.querySelector('#pronouns-other');
        if (!select || !other) return;

        const toggle = () => {
            if (select.value === 'other') {
                other.classList.remove('hidden');
                other.name = select.name;
                select.removeAttribute('name');
                other.required = false; // field optional
            } else {
                other.classList.add('hidden');
                other.removeAttribute('name');
                select.name = 'Preferred pronouns';
                other.value = '';
            }
        };

        select.addEventListener('change', toggle);
        toggle();
    });
});
