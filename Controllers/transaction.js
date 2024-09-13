const transactionService = new(require('../UseCases/transaction'))();
module.exports = function (app, express) {
    let router = express.Router();
    // get list of transactions
    router.get('/', async (req, res) => {
        try {
            const transaction = await transactionService.list();
            res.status(201).json(transaction);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });
    // Create new transfer
    router.post('/transfer', async (req, res) => {
        try {
            const { receiverEmail, points } = req.body;
            const transaction = await transactionService.createTransfer(req.user, receiverEmail, points);
            res.status(201).json(transaction);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    router.post('/transfer/process', async (req, res) => {
        try {
            const { transactionId, action } = req.body;
            if (!['confirm', 'reject'].includes(action)) {
                return res.status(400).json({ message: 'Invalid action' });
            }

            const transaction = await transactionService.processTransfer(transactionId, action, req.user);
            res.status(200).json(transaction);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });
    router.post('/expired', async (req, res) => {
        try {
            const transaction = await transactionService.handleExpiredTransactions();
            res.status(200).json(transaction);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });
    return router;
}
