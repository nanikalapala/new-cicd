const express = require('express');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/members', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'members.html'));
});

app.get('/policies', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'policies.html'));
});

app.get('/claims', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'claims.html'));
});

app.get('/payments', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'payments.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/login-failed', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login-failed.html'));
});

app.post('/login', (req, res) => {

    const { email, password } = req.body;

    if (
        email === 'admin@insurance.com' &&
        password === 'admin123'
    ) {
        return res.redirect('/dashboard');
    }

    return res.redirect('/login-failed');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/settings', (req, res) => {
    res.sendFile(__dirname + '/public/settings.html');
});
