"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const users_1 = require("./routes/users");
const port = process.env.PORT;
exports.app = (0, express_1.default)();
exports.app.set('view engine', 'pug');
exports.app.set('views', path_1.default.join(__dirname, './views'));
const whitelist = ['http://localhost:3000', 'http://localhost:3001'];
exports.app.get('/', (req, res) => {
    res.render('index.pug');
});
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
exports.app.use((0, morgan_1.default)('dev'));
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: false }));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
exports.app.use((0, helmet_1.default)());
exports.app.use((0, cors_1.default)(corsOptions));
exports.app.use('/users', users_1.userRouter);
// catch 404 and forward to error handler
exports.app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
// error handler
exports.app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
