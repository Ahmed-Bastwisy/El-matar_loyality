const Transaction = require('../Core/transaction');
const mongoose = require('mongoose');
const CustomError = require('../utils/customError');

module.exports = class TransactionRepository {
    async createTransaction(senderWalletId, receiverWalletId, points, session = null) {
        const transaction = new Transaction({
            senderWalletId,
            receiverWalletId,
            points,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });`    `
        return await transaction.save({ session });
    }

    async findTransactionById(transactionId, session = null) {
        if (!mongoose.Types.ObjectId.isValid(transactionId)) throw new CustomError(`Invalid transaction ID: ${transactionId}`, 500)
        return await Transaction.findById(transactionId).session(session).exec();
    }

    async updateTransactionStatus (id, status, session = null) {
        return await Transaction.findByIdAndUpdate(id, { status }, { new: true, session });
    };
    async find (criteria = {}, session = null) {
        return await Transaction.find(criteria).session(session).exec();
    };
}