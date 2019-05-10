const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
const _ = require('lodash');
const OrganizationModel = require('./organizationModel');

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    },
    completedAt: {
        type: Date
    },
    completedAtExpected: {
        type: Date
    },
    name: {
        type: String,
        required: 'Please enter the project name'
    },
    status: {
        type: String,
        default: 'Ongoing'
    },
    description: {
        type: String
    },
    organizationId: {
        type: Schema.Types.String,
        required: 'Organization is required'
    },
    organization: {
        type: Object,
        required: 'objectId of the organization is needed'
    },
    alliance: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    tags: {
        type: [String],
        default: []
    },
    eventIds: {
        type: [Schema.Types.ObjectId]
    }
});

ProjectSchema.statics.addEventId = function (projectId, eventId) {
    return this.findOneAndUpdate({ _id: projectId }, { $push: { events: eventId } }, { new: true }).exec();
};

ProjectSchema.statics.getById = function (projectId) {
    return this.findOne({ _id: projectId }).lean()
        .then(project => {
            return OrganizationModel.find({ _id: { $in: project.alliance } })
                .then(organizations => {
                    project.alliance_data = organizations;
                    return project;
                });
        });
};

ProjectSchema.statics.getMultipleById = function (projectIds) {
    const projectIdObjectIdArray = _.map(projectIds, ObjectId);
    return this.find({ _id: { $in: projectIdObjectIdArray } }).exec()
        .then(projects => projects)
        .catch(err => console.log(err));
};

module.exports = mongoose.model('ProjectModel', ProjectSchema);
