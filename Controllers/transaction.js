const transactionService = new(require('../UseCases/transaction'))();
module.exports = function (app, express) {
    let router = express.Router();
    // get list of transactions
    router.get('/', async (req, res, next) => {
        try {
            const transaction = await transactionService.list();
            res.status(201).json(transaction);
        } catch (err) {
            next(err); 
        }
    });
    // Create new transfer
    router.post('/transfer', async (req, res, next) => {
        try {
            const { receiverEmail, points } = req.body;
            const transaction = await transactionService.createTransfer(req.user, receiverEmail, points);
            res.status(201).json(transaction);
        } catch (err) {
            next(err); 
        }
    });

    router.post('/transfer/process', async (req, res, next) => {
        try {
            const { transactionId, action } = req.body;
            if (!['confirm', 'reject'].includes(action)) {
                return res.status(400).json({ message: 'Invalid action' });
            }

            const transaction = await transactionService.processTransfer(transactionId, action, req.user);
            res.status(200).json(transaction);
        } catch (err) {
            next(err); 
        }
    });
    router.post('/expired', async (req, res, next) => {
        try {
            const transaction = await transactionService.handleExpiredTransactions();
            res.status(200).json(transaction);
        } catch (err) {
            next(err); 
        }
    });
    return router;
}
