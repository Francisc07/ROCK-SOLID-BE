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
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("../src/config");
const port = 3000;
const app = (0, express_1.default)();
app.set('view engine', 'ejs'); // Specify the default engine (e.g., 'ejs')
const whitelist = ['http://localhost:3000', 'http://localhost:3001'];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)(corsOptions));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect the client to the server	(optional starting in v4.7)
            yield config_1.client.connect();
            // Send a ping to confirm a successful connection
            yield config_1.client.db('admin').command({ ping: 1 });
            console.log('Pinged your deployment. You successfully connected to MongoDB!');
        }
        finally {
            // Ensures that the client will close when you finish/error
            yield config_1.client.close();
        }
    });
}
run().catch(console.dir);
const dbName = 'sample_mflix';
const collectionName = 'users';
// Create references to the database and collection in order to run
// operations on them.
const database = config_1.client.db(dbName);
const collection = database.collection(collectionName);
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    debugger;
    try {
        const usuarios = yield collection.find().sort({ name: 1 });
        res.send(usuarios);
        // add a linebreak
        console.log(usuarios);
    }
    catch (err) {
        console.error(`Something went wrong trying to find the documents: ${err}\n`);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
}));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
module.exports = app;
