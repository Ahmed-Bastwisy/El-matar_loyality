const Transaction = require('../Core/transaction');

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
        return await Transaction.findById(transactionId).session(session).exec();
    }

    async updateTransactionStatus (id, status, session = null) {
        return await Transaction.findByIdAndUpdate(id, { status }, { new: true, session });
    };
    async find (criteria = {}, session = null) {
        return await Transaction.find(criteria).session(session).exec();
    };
}