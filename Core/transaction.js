const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    senderWalletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
    receiverWalletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
    points: Number,
    status: { type: String, enum: ['pending', 'confirmed', 'rejected', 'expired'], default: 'pending' },
    expiresAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
