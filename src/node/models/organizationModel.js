const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrganizationSchema = new Schema({
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    },
    name: {
        type: String,
        required: 'Please enter the organization name'
    },
    category: {
        type: String,
        default: 'Miscellaneous'
    },
    address: {
        street: {
			type: String
		},
        city: {
			type: String
		},
		state: {
			type: String
        },
        zipcode: {
            type: Number
        },
    },
    contactInformation: {
        phoneNumber: {
            type: String
        },
        email: {
            type: String
        }
    },
    website: {
        type: String
    },
    description: {
        type: String
    },
    projectIds: {
        type: [String],
        default: []
    },
    memberIds: {
        type: [String]
    },
    tags: {
        type: [String],
        default: []
    },
    interests: {
        type: [String],
        default: []
    },
});

OrganizationSchema.statics.getById = function (organizationId) {
    return this.findOne({ _id: organizationId })
        .then(res => res)
        .catch(err => err);
};

module.exports = mongoose.model('OrganizationModel', OrganizationSchema);
