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
        required: true,
        default: 'Other'
    },
    phoneNumber: {
        type: String
    },
    email: {
        type: String
    },
    website: {
        type: String
    },
    streetAddress: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    zipCode: {
        type: String
    },
    description: {
        type: String
    },
    missionStatement: {
        type: String
    },
    tags: {
        type: Array,
        default: []
    },
    adminIds: {
        type: Array,
        default: []
    }
}, { timestamps: true });

const Organization = mongoose.model('organizations', OrganizationSchema);

module.exports = Organization;