const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

/* Middleware */

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

/* Pages */

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

app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/change-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'change-password.html'));
});

app.get('/notifications', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notifications.html'));
});

app.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'users.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/login-failed', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login-failed.html'));
});

/* Login */

app.post('/login', (req, res) => {

    const { email, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE email=? AND password=?',
        [email, password],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.send('Database Error');
            }

            if (result.length > 0) {
                return res.redirect('/dashboard');
            }

            return res.redirect('/login-failed');
        }
    );
});

/* Add Member */

app.post('/add-member', (req, res) => {

    const {
        name,
        email,
        phone,
        policy
    } = req.body;

    db.query(
        'INSERT INTO members(name,email,phone,policy) VALUES(?,?,?,?)',
        [name, email, phone, policy],
        (err) => {

            if (err) {
                console.log(err);
                return res.send('Error adding member');
            }

            res.redirect('/members');
        }
    );
});

/* Dashboard API */

app.get('/api/dashboard', (req, res) => {

    db.query(`
        SELECT
        (SELECT COUNT(*) FROM policies) AS totalPolicies,
        (SELECT COUNT(*) FROM policies WHERE status='Active') AS activePolicies,
        (SELECT COUNT(*) FROM claims) AS totalClaims,
        (SELECT COUNT(*) FROM members) AS totalCustomers
    `, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result[0]);

    });

});

/* Policies API */

app.get('/api/policies', (req, res) => {

    db.query(
        'SELECT * FROM policies',
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);
        }
    );

});

/* Claims API */

app.get('/api/claims', (req, res) => {

    db.query(
        'SELECT * FROM claims',
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);
        }
    );

});

/* Members API */

app.get('/api/members', (req, res) => {

    db.query(
        'SELECT * FROM members',
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);
        }
    );

});

/* Health Check */

app.get('/health', (req, res) => {

    res.json({
        status: 'UP',
        app: 'Insurance Portal',
        database: 'Connected'
    });

});

/* Start Server */

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Insurance Portal running on port ${PORT}`);
});
