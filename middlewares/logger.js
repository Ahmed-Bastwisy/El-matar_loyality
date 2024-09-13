module.exports = function(req, res, next) {
    res.on('finish', () => {
        let _obj = {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            name: req.user ? req.user.name : 'Unknown user',
            body: JSON.stringify(req.body),
            status: res.statusCode,
            date: new Date()
        };
        console.log(_obj);
    });
    next();
};
