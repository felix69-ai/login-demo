document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const bruteForceBtn = document.getElementById('brute-force-btn');
    const passwordListInput = document.getElementById('password-list');
    const logContainer = document.getElementById('log-container');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('toggle-password');
    const demoToggle = document.getElementById('demo-toggle');
    const demoFeatures = document.querySelector('.demo-features');

    const eyeOpenSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    const eyeClosedSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

    // Set initial icon
    togglePassword.innerHTML = eyeOpenSVG;

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        // Change icon
        togglePassword.innerHTML = type === 'password' ? eyeOpenSVG : eyeClosedSVG;
    });

    const levelSelect = document.getElementById('level');

    // Handle visibility toggle
    demoToggle.addEventListener('change', () => {
        demoFeatures.classList.toggle('hidden');
        document.querySelector('.main-container').classList.toggle('demo-active');
    });

    // Handle manual login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = document.getElementById('password').value;
        const level = levelSelect.value;
        
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, level })
        });

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
            const data = await response.json();
            if (data.success) {
                log('Manual login successful!', 'success');
            } else {
                log('Manual login failed.', 'fail');
            }
        } else {
            log('Manual login failed.', 'fail');
        }
    });

    // Handle brute-force attack
    bruteForceBtn.addEventListener('click', () => {
        const file = passwordListInput.files[0];
        if (!file) {
            log('Please select a password list file first.', 'info');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const passwords = e.target.result.split(/\r?\n/).filter(p => p); // Filter out empty lines
            log(`Starting attack with ${passwords.length} passwords...`, 'info');
            
            let found = false;
            for (const password of passwords) {
                const username = usernameInput.value;
                const level = levelSelect.value;

                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password, level })
                });

                const contentType = response.headers.get('content-type');
                if (contentType && contentType.indexOf('application/json') !== -1) {
                    const data = await response.json();
                    if (data.success) {
                        log(`SUCCESS! Password found: ${password}`, 'success');
                        found = true;
                        break; // Stop the attack
                    } else {
                        log(`Trying password: ${password}`, 'fail');
                    }
                } else {
                    log(`Trying password: ${password}`, 'fail');
                    // Optional: add a small delay to visualize the process
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
            if (!found) {
                log('Attack finished. Password not found in the list.', 'info');
            }
        };

        reader.readAsText(file);
    });

    function log(message, status = 'info') {
        const entry = document.createElement('div');
        entry.classList.add('log-entry', `log-${status}`);
        entry.textContent = message;
        logContainer.appendChild(entry);
        logContainer.scrollTop = logContainer.scrollHeight; // Auto-scroll
    }
});