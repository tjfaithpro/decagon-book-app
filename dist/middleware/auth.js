"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorModel_1 = require("../model/authorModel");
// generate token
const generateToken = (authorData) => {
    return jsonwebtoken_1.default.sign({ authorData }, process.env.MY_SECRET, { expiresIn: '7d' });
};
exports.generateToken = generateToken;
// verify token
async function verifyToken(req, res, next) {
    try {
        // const bearerHeader = req.headers.authorization
        const bearerHeader = req.cookies.authorized;
        // check if bearer is undefined 
        if (!bearerHeader) {
            //  res.status(404).json({ Error: "Author not verified" });
            return res.redirect('/');
        }
        // const token  = bearerHeader.split(' ')[1]   
        const token = bearerHeader;
        let verified = jsonwebtoken_1.default.verify(token, process.env.MY_SECRET);
        if (!verified) {
            return res.redirect('/');
            // return res.status(403).json({ Error: "Unauthorized user" })
        }
        const { authorData } = verified;
        const author = await authorModel_1.AuthorInstance.findOne({ where: { id: authorData } });
        if (!author) {
            // return res.status(403).json({ Error: "Author not verified" });
            return res.redirect('/');
        }
        req.authorId = authorData;
        next();
    }
    catch (error) {
        res.redirect('/');
        // res.status(403).json({Error: "Unauthorized"});
    }
}
exports.verifyToken = verifyToken;
