document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(q => {
        q.addEventListener('click', () => {
            const item = q.closest('.faq-item');
            const wasOpen = item.classList.contains('open');

            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

            if (!wasOpen) {
                item.classList.add('open');
            }
        });
    });

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('c-name')?.value.trim();
            const email = document.getElementById('c-email')?.value.trim();
            const msg = document.getElementById('c-msg')?.value.trim();

            if (!name || !email || !msg) {
                showToast('Please fill out all required fields.');
                return;
            }

            alert(`Thank you, ${name}! Your inquiry has been received. Our team will contact you at ${email} shortly.`);
            contactForm.reset();
        });
    }
});
