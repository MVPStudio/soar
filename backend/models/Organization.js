const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;

const OrganizationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String
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
    }
}, { timestamps: true });

const Organization = mongoose.model('organizations', OrganizationSchema);

module.exports = Organization;