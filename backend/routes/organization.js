const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

const Organization = require('../models/Organization');

router.post('/register', function(req, res) {

    const { errors, isValid } = validateRegisterInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }
    Organization.findOne({
        email: req.body.email
    }).then(org => {
        if(org) {
            return res.status(400).json({
                email: 'Email already exists'
            });
        }
        else {
            const newOrg = new Organization({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            
            bcrypt.genSalt(10, (err, salt) => {
                if(err) console.error('There was an error', err);
                else {
                    bcrypt.hash(newOrg.password, salt, (err, hash) => {
                        if(err) console.error('There was an error', err);
                        else {
                            newOrg.password = hash;
                            newOrg
                                .save()
                                .then(org => {
                                    res.json(org)
                                }); 
                        }
                    });
                }
            });
        }
    });
});

router.post('/login', (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    Organization.findOne({email})
        .then(org => {
            if(!org) {
                errors.email = 'Organization not found'
                return res.status(404).json(errors);
            }
            bcrypt.compare(password, org.password)
                    .then(isMatch => {
                        if(isMatch) {
                            const payload = {
                                id: org.id,
                                name: org.name,
                            }
                            jwt.sign(payload, 'secret', {
                                expiresIn: 3600
                            }, (err, token) => {
                                if(err) console.error('There is some error in token', err);
                                else {
                                    res.json({
                                        success: true,
                                        token: `Bearer ${token}`
                                    });
                                }
                            });
                        }
                        else {
                            errors.password = 'Incorrect Password';
                            return res.status(400).json(errors);
                        }
                    });
        });
});

router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({
        id: req.org.id,
        name: req.org.name,
        email: req.org.email
    });
});

module.exports = router;