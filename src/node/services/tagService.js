const mongoose = require('mongoose');

const TagModel = mongoose.model('TagModel');

module.exports = {
    getAll: () => {
        return TagModel.find();
    },

    async getByID(tagId) {
        return await TagModel.findById(tagId);
    },

    async createTag(name, type) {
        return await TagModel.create(name, type);
    },

    async deleteTag(tagId) {
        return await TagModel.findByIdAndDelete(tagId);
    }
};
