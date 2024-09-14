const repo = new(require('../Reposatories/user'))();
const walletRepository = new(require('../Reposatories/wallet'))();
const transactionRepository = new(require('../Reposatories/transaction'))();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CustomError = require('../utils/customError');

module.exports = class UserService {
    async registerUser (name, email, password) {
        const existingUser = await repo.findOne({email});
        if (existingUser) {
            throw new CustomError(`User already exists`, 400);
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await repo.create({"name":name, "email": email, "password": hashedPassword});
        // Initialize wallet with default points (500 points as a gift)
        await walletRepository.create(user._id);

        return user;
    };
    
    async login (email, password) {
        let user = await repo.findOne({email});
        if (!user) throw new CustomError(`Invalid email or password`, 400);
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new CustomError(`Invalid email or password`, 400);
        user = user._doc;
        user.id = user._id;
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
        return token;
    };

    async getWallet(user) {
        try {
            const result = await walletRepository.findOne({ userId: user.id });
            if (!result) {
                throw new CustomError(`User not found`, 400);
            }
            return result;
        } catch (error) {
            throw new CustomError(`${error.message}`, 400);
        } 
    }

    async getTransactions(user) {
        try {
            const wallet = await this.getWallet(user);
            const sendTransaction = await transactionRepository.find({ "senderWalletId": wallet._id });
            const RecievedTransaction = await transactionRepository.find({ "receiverWalletId": wallet._id });
            let obj = {
                wallet, 
                sendTransaction,
                RecievedTransaction
            }
            return obj;
        } catch (error) {
            throw new CustomError(`${error.message}`, 400);
        } 
    }

    // Update user details
    async updateUser(_obj) {
        try {
            const result = await repo.update({ _id: _obj._id }, _obj);
            return result;
        } catch (error) {
            throw new CustomError(`${error.message}`, 400);
        }
    }

    // Get user by ID
    async getUserById(userId) {
        try {
            const user = await repo.findById(userId);
            if (!user) {
                throw new CustomError(`User not found`, 400);
            }
            return user;
        } catch (error) {
            throw new CustomError(`${error.message}`, 400);
        }
    }
    
    // Get user by Email
    async getUserByEmail(email) {
        try {
            const user = await repo.findOne({"email" : email});
            if (!user) {
                throw new CustomError(`User not found`, 400);
            }
            return user;
        } catch (error) {
            throw new CustomError(`${error.message}`, 400);
        }
    }

    // Delete user by ID
    async deleteUser(userId) {
        try {
            const result = await repo.delete({ _id: userId });
            if (!result) {
                throw new CustomError(`User not found`, 400);
            }
            return result;
        } catch (error) {
            throw new CustomError(`${error.message}`, 400);
        }
    }
};
