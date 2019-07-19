const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;

const OrganizationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: 'Other'
    },
    description: {
        type: String,
        default: ''
    },
    tags: {
        type: Array,
        default: []
    },
    phoneNumber: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    website: {
        type: String,
        default: ''
    },
    streetAddress: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        default: ''
    },
    zipCode: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const Organization = mongoose.model('organizations', OrganizationSchema);

module.exports = Organization;