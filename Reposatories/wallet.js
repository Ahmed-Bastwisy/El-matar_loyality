const Wallet = require('../Core/wallet');

module.exports = class WalletRepository {
    async list() {
        return await Wallet.find().populate("userId","_id name email").exec();
    }

    async findOne(criteria, session = null) {
        return await Wallet.findOne(criteria).populate("userId", "_id name email").session(session).exec();
    }

    async findById(walletId, session = null) {
        return await Wallet.findById(walletId).populate("userId", "_id name email").session(session).exec();
    }

    async create(userId) {
        const wallet = new Wallet({ userId });
        return await wallet.save();
    }

    // Update wallet
    async update(criteria, updates, session = null) {
        return await Wallet.findOneAndUpdate(criteria, updates, { new: true, session }).exec();
    }

    // Check if user has sufficient points
    async hasSufficientBalance(userId, amount) {
        const wallet = await this.findWalletByUserId(userId);
        return wallet && wallet.balance >= amount;
    }
}
