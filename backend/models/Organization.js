const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrganizationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    website: {
        type: String
    },
    address: {
        type: String
    },
    description: {
        type: String
    },
    tags: {
        type: Array,
        default: []
    },
    adminIds: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Organization = mongoose.model('organizations', OrganizationSchema);

module.exports = Organization;