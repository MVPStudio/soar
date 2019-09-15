const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;

const OrganizationSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        default: ''
    },
    Actions: {
        type: Array,
        default: []
    },
    Phone: {
        type: String,
        default: ''
    },
    Email: {
        type: String,
        default: ''
    },
    Contact: {
        type: String,
        default: ''
    },
    Website: {
        type: String,
        default: ''
    },
    Address: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const Organization = mongoose.model('organizations', OrganizationSchema);

module.exports = Organization;