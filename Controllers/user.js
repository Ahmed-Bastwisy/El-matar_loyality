const userService = new (require('../UseCases/user'))();
module.exports = function (app, express) {
    let router = express.Router();
    // get user
    router.get('/wallet', async (req, res, next) => {
        try {
            const user = await userService.getWallet(req.user);
            res.status(201).json(user);
        } catch (err) {
            next(err); 
        }
    });
    router.get('/transactions', async (req, res, next) => {
        try {
            const transactions = await userService.getTransactions(req.user);
            res.status(201).json(transactions);
        } catch (err) {
            next(err); 
        }
    });
    // Register new user
    router.post('/register', async (req, res, next) => {
        try {
            const { name, email, password } = req.body;
            const user = await userService.registerUser(name, email, password);
            res.status(201).json(user);
        } catch (err) {
            next(err); 
        }
    });

    // Sign in
    router.post('/login', async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const token = await userService.login(email, password);
            res.status(200).json({ token });
        } catch (err) {
            next(err); 
        }
    });
    return router;
}
