
const express = require('express');
const app = express();
const port = 3000;

// Hardcoded credentials
const correctUsername = 'admin';
const correctPassword = 'password';

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === correctUsername && password === correctPassword) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
