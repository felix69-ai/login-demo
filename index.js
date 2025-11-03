
const express = require('express');
const app = express();
const port = 3000;

// Hardcoded credentials for different levels
const credentials = {
    '1': { username: 'user1', password: 'password1' },
    '2': { username: 'user2', password: 'password2' },
    '3': { username: 'user3', password: 'password3' },
    'admin': { username: 'user3', password: 'password3' }
};

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/login', (req, res) => {
    const { username, password, level } = req.body;

    if (credentials[level] && username === credentials[level].username && password.toLowerCase() === credentials[level].password.toLowerCase()) {
        res.json({ success: true });
    } else {
        res.send("<h1>Invalid username or password</h1>");
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
