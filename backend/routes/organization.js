const express = require('express');
const router = express.Router();

const Organization = require('../models/Organization');

router.get('/', (req, res) => {
    Organization.find({})
        .then(orgs => res.status(200).json(orgs))
})

router.get('/:id', (req, res) => {
    Organization.findOne({ _id: req.params.id })
        .then(org => res.status(200).json(org))
})

router.post('/create', (req, res) => {
    Organization.findOne({ name: req.body.name })
        .then(org => {
            if (org) {
                return res.status(400).json({
                    name: 'Organization with this name already exists'
                });
            } else {
                const newOrg = new Organization({
                    name: req.body.name
                })

                newOrg.save()
                .then(org => res.status(201).json(org))
            }
        })
});

router.post('/edit/:id', (req, res) => {
    Organization.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, (err, updatedOrg) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(updatedOrg);
    })

});

module.exports = router;