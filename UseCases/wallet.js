const walletRepository = new(require('../Reposatories/wallet'))();
const userService = new(require('../UseCases/user'))();
const CustomError = require('../utils/customError');

module.exports = class WalletUseCase {
    async findWalletByUserId(userId, session) {
        return await walletRepository.findOne({userId}, session);
    }
    async findWalletByEmail(email, session) {
        let user = await userService.getUserByEmail(email);
        if (!user) {
            throw new CustomError(`User not found`, 400);
        }
        return await this.findWalletByUserId(user._id, session);
    }

    async findWalletById(walletId) {
        return await walletRepository.findById(walletId);
    }

    async list() {
        return await walletRepository.list();
    }

    async updateWallet(walletId, updatedObj,session = null) {
        const updatedWallet = await walletRepository.update({"_id": walletId}, updatedObj , session);
        return updatedWallet;
    }

    async createWallet(userId) {
        return await walletRepository.create(userId);
    }
}

