exports.logger = (req, res, next) =>{
    const {method, originalUrl} = req;
    const time = new Date().toLocaleString();
    console.log(`Log: [${time}] ** ${method} -> ${originalUrl}`);
    next();
}