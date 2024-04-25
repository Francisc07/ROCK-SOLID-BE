"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const config_1 = require("./config/config");
const dbName = process.env.DB_NAME;
const collectionName = 'users';
exports.userRouter = express_1.default.Router();
exports.userRouter.get('/getUsers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield config_1.client.connect();
        // Send a ping to confirm a successful connection
        yield config_1.client.db('admin').command({ ping: 1 });
        const database = config_1.client.db(dbName);
        const collection = database.collection(collectionName);
        const usuarios = yield collection.find({}).toArray();
        res.send(usuarios);
        config_1.client.close();
        // add a linebreak
    }
    catch (err) {
        console.error(`Something went wrong trying to find the documents: ${err}\n`);
        res.status(500).json({ message: 'Error al obtener usuarios' });
        config_1.client.close();
    }
}));
