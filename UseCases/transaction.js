const mongoose = require('mongoose');
const TransactionRepository = new (require('../Reposatories/transaction'))();
const WalletService = new (require('../UseCases/wallet'))();
const CustomError = require('../utils/customError');

// TransferService class
module.exports = class TransferService {
    async list() {
        return await TransactionRepository.find();
    }
    // Create a new transfer
    async createTransfer(sender, receiverEmail, points) {
        const senderId = sender.id;
        if (sender.email == receiverEmail) throw new CustomError(`Can't transfer To yourSelf`, 400);
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Find the sender and receiver wallets within the transaction session
            const senderWallet = await WalletService.findWalletByUserId(senderId, session);
            const receiverWallet = await WalletService.findWalletByEmail(receiverEmail, session);

            if (!senderWallet) throw new CustomError(`Sender wallet not found`, 400);
            if (!receiverWallet) throw new CustomError(`Receiver wallet not found`, 400);

            senderWallet.reservedPoints += parseInt(points);
            if (senderWallet.balance < senderWallet.reservedPoints) {
                throw new CustomError(`Insufficient balance`, 400);
            }

            // Reserve points for transfer
            await senderWallet.save({ session });

            // Create the transaction
            const transaction = await TransactionRepository.createTransaction(senderWallet._id, receiverWallet._id, points, session);

            await session.commitTransaction();
            session.endSession();

            return transaction;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw new CustomError(`${error.message}`, 400);
        }
    }

    // Process a transfer based on action (confirm or reject)
    async processTransfer(transactionId, action, user) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const transaction = await TransactionRepository.findTransactionById(transactionId, session);
            if (!transaction) throw new CustomError(`Transaction not found`, 400);
            if (transaction.status !== 'pending') throw new CustomError(`Transaction already processed or expired`, 400);
            const receiverWallet = await WalletService.findWalletById(transaction.receiverWalletId, session);
            if(receiverWallet.userId._id != user.id) throw new CustomError(`not authorize to process this transaction`, 400);
            if (!receiverWallet) throw new CustomError(`Receiver wallet not found`, 400);
            if (transaction.expiresAt < new Date()){
                transaction.status = 'expired';
                await TransactionRepository.updateTransactionStatus(transaction._id,transaction.status);
                // Subtract points from sender's wallet
                await WalletService.updateWallet(transaction.senderWalletId, { $inc: { reservedPoints: -1*parseInt(transaction.points) } });
                throw new CustomError(`transaction already expired`, 400);
            }
            const senderWallet = await WalletService.findWalletById(transaction.senderWalletId, session);

            if (!senderWallet) throw new CustomError(`Sender wallet not found`, 400);

            let strategy;
            if (action === 'confirm') {
                strategy = new ConfirmTransferStrategy();
            } else if (action === 'reject') {
                strategy = new RejectTransferStrategy();
            } else {
                throw new CustomError(`Invalid action`, 400);
            }

            const points = transaction.points;
            await strategy.execute(transaction, senderWallet, receiverWallet, parseInt(points), session);

            await session.commitTransaction();
            session.endSession();

            return transaction;
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            throw new CustomError(`${err}`, 400);
        }
    }
    async handleExpiredTransactions() {
        const currentTime = new Date();
        try {
            // Find all pending transactions that have expired
            const expiredTransactions = await TransactionRepository.find({
                status: 'pending',
                expiresAt: { $lt: currentTime },
            });

            // Loop through all expired transactions and update them
            for (let transaction of expiredTransactions) {
                // Update transaction status to 'expired'
                transaction.status = 'expired';
                await transaction.save();

                // Subtract points from sender's wallet
                await WalletService.updateWallet(transaction.senderWalletId, { $inc: { reservedPoints: -1*parseInt(transaction.points) } });
            }

            return `Updated ${expiredTransactions.length} expired transactions.`;
        } catch (error) {
            throw new CustomError(`${error.message}`, 400);
        }
    }
}

// Strategy base class
class TransferStrategy {
    async execute(transaction, senderWallet, receiverWallet, points, session) {
        throw new CustomError(`Error Method not implemented`, 400);
    }
}

// Concrete strategy for confirming transfer
class ConfirmTransferStrategy extends TransferStrategy {
    async execute(transaction, senderWallet, receiverWallet, points, session) {
        if (senderWallet.balance < points) {
            throw new CustomError(`Insufficient balance`, 400);
        }
        senderWallet.balance -= points;
        receiverWallet.balance += points;
        senderWallet.reservedPoints -= points;
        transaction.status = 'confirmed';

        await senderWallet.save({ session });
        await receiverWallet.save({ session });
        await transaction.save({ session });

        return transaction;
    }
}

// Concrete strategy for rejecting transfer
class RejectTransferStrategy extends TransferStrategy {
    async execute(transaction, senderWallet, receiverWallet, points, session) {
        senderWallet.reservedPoints -= points;
        transaction.status = 'rejected';

        await senderWallet.save({ session });
        await transaction.save({ session });

        return transaction;
    }
}