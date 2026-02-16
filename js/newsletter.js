document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('.footer-newsletter');

    forms.forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var input = form.querySelector('.footer-newsletter-input');
            var btn = form.querySelector('.footer-newsletter-btn');
            var email = input.value.trim();

            if (!email) return;

            btn.disabled = true;
            btn.textContent = 'Sending...';

            fetch('https://a.klaviyo.com/client/subscriptions/?company_id=RUy9pb', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'revision': '2024-10-15'
                },
                body: JSON.stringify({
                    data: {
                        type: 'subscription',
                        attributes: {
                            profile: {
                                data: {
                                    type: 'profile',
                                    attributes: { email: email }
                                }
                            },
                            custom_source: 'Portfolio Website'
                        },
                        relationships: {
                            list: {
                                data: { type: 'list', id: 'WRWsqQ' }
                            }
                        }
                    }
                })
            })
            .then(function (res) {
                if (res.ok || res.status === 202) {
                    input.value = '';
                    btn.textContent = 'Subscribed!';
                    setTimeout(function () {
                        btn.textContent = 'Sign Up';
                        btn.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Request failed');
                }
            })
            .catch(function () {
                btn.textContent = 'Error';
                setTimeout(function () {
                    btn.textContent = 'Sign Up';
                    btn.disabled = false;
                }, 3000);
            });
        });
    });
});
