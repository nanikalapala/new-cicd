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
        fullname,
        email,
        phone,
        policy_type
    } = req.body;

    db.query(
        'INSERT INTO members(fullname,email,phone,policy_type) VALUES(?,?,?,?)',
        [fullname, email, phone, policy_type],
        (err) => {

            if (err) {
                console.log(err);
                return res.send('Error adding member');
            }

            res.redirect('/members');
        }
    );
});

/* Dashboard Statistics API */

app.get('/api/dashboard', (req, res) => {

    db.query(
        'SELECT COUNT(*) AS totalPolicies FROM policies',
        (err, policies) => {

            if (err) return res.status(500).json(err);

            db.query(
                'SELECT COUNT(*) AS totalClaims FROM claims',
                (err, claims) => {

                    if (err) return res.status(500).json(err);

                    db.query(
                        'SELECT COUNT(*) AS totalCustomers FROM members',
                        (err, members) => {

                            if (err) return res.status(500).json(err);

                            res.json({
                                policies: policies[0].totalPolicies,
                                claims: claims[0].totalClaims,
                                customers: members[0].totalCustomers
                            });
                        }
                    );
                }
            );
        }
    );
});

/* Health Check */

app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        app: 'Insurance Portal'
    });
});

/* Start Server */

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Insurance Portal running on port ${PORT}`);
});

