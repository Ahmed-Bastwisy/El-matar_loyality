const walletService = new(require('../UseCases/wallet'))();
module.exports = function (app, express) {
    let router = express.Router();
    // list of wallet
    router.get('/', async (req, res, next) => {
        try {
            const walletList = await walletService.list();
            res.status(201).json(walletList);
        } catch (err) {
            next(err); 
        }
    });

    // get Wallet
    router.get('/:id', async (req, res, next) => {
        try {
            const wallet = await walletService.findWalletById(req.params.id);
            res.status(200).json({ wallet });
        } catch (err) {
            next(err); 
        }
    });
    return router;
}
