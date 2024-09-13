const walletService = new(require('../UseCases/wallet'))();
module.exports = function (app, express) {
    let router = express.Router();
    // list of wallet
    router.get('/', async (req, res) => {
        try {
            const walletList = await walletService.list();
            res.status(201).json(walletList);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    // get Wallet
    router.get('/:id', async (req, res) => {
        try {
            const wallet = await walletService.findWalletById(req.params.id);
            res.status(200).json({ wallet });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });
    return router;
}
