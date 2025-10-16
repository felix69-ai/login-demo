document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const bruteForceBtn = document.getElementById('brute-force-btn');
    const passwordListInput = document.getElementById('password-list');
    const logContainer = document.getElementById('log-container');
    const usernameInput = document.getElementById('username');
    const demoToggle = document.getElementById('demo-toggle');
    const demoFeatures = document.querySelector('.demo-features');

    // Handle visibility toggle
    demoToggle.addEventListener('change', () => {
        demoFeatures.classList.toggle('hidden');
    });

    // Handle manual login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = document.getElementById('password').value;
        
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            log('Manual login successful!', 'success');
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

                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    log(`Trying password: ${password}` , 'fail');
                    await new Promise(resolve => setTimeout(resolve, 50)); // short delay to show the last failed attempt
                    log(`SUCCESS! Password found: ${password}`, 'success');
                    found = true;
                    break; // Stop the attack
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