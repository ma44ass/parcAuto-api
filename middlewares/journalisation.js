export default function journalisation(req, res, next){
    console.log(`${req.method} ${req.originalUrl}`);
    next()
}