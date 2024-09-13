const User = require('../Core/user');

module.exports = class UserRepository {
    // Create a new user
    async create(userData) {
        const user = new User(userData);
        return await user.save();
    }

    // Find a user by ID
    async findById(userId) {
        return await User.findById(userId).exec();
    }

    // Find a user by a given criteria
    async findOne(criteria) {
        return await User.findOne(criteria).exec();
    }

    // Update user details
    async update(criteria, updateData) {
        return await User.findOneAndUpdate(criteria, updateData, { new: true }).exec();
    }

    // Delete a user by ID
    async delete(criteria) {
        return await User.findOneAndDelete(criteria).exec();
    }
}
