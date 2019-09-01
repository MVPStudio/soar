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
                return res.status(409).json({
                    name: 'Organization with this name already exists'
                });
            } else {
                const newOrg = new Organization({
                    ...req.body
                })

                newOrg.save()
                    .then(org => res.status(201).json(org))
                    .catch(err => res.status(400).json(err))
            }
        })
});

router.put('/:id', (req, res) => {
    Organization.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true, runValidators: true })
        .then(updatedOrg => res.status(200).json(updatedOrg))
        .catch(err => {
            const isValidationError = err.name === 'ValidationError';
            return res.status(isValidationError ? 400 : 500).json(err);
        })
});

router.delete('/:id', (req, res) => {
    Organization.findOneAndDelete({ _id: req.params.id })
        .then(deletedOrg => {
            if (deletedOrg) res.status(204).end();
            else res.status(404).end();
        })
        .catch(err => res.status(500).json(err));
});

module.exports = router;
