"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCode = exports.createQrCode = exports.generateSecretKey = void 0;
var qr = __importStar(require("qrcode"));
var crypto = __importStar(require("crypto"));
function generateSecretKey() {
    var validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    var secretBuilder = "";
    for (var i = 0; i < 32; i++) {
        var randomIndex = Math.floor(Math.random() * validChars.length);
        secretBuilder += validChars.charAt(randomIndex);
    }
    return secretBuilder;
}
exports.generateSecretKey = generateSecretKey;
function createQrCode(email, secretKey, companyName) {
    return __awaiter(this, void 0, void 0, function () {
        var barCodeData, qrCode, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    barCodeData = prepareUri(email, secretKey, companyName);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, qr.toDataURL(barCodeData)];
                case 2:
                    qrCode = _a.sent();
                    return [2 /*return*/, qrCode];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error creating QR code:", error_1);
                    throw new Error("Error creating QR code");
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.createQrCode = createQrCode;
function prepareUri(email, secretKey, companyName) {
    var encodedEmail = encodeURIComponent("".concat(companyName, ":").concat(email));
    var encodedSecretKey = encodeURIComponent(secretKey);
    var encodedIssuer = encodeURIComponent(companyName);
    return "otpauth://totp/".concat(encodedEmail, "?secret=").concat(encodedSecretKey, "&issuer=").concat(encodedIssuer).replace(/\+/g, "%20");
}
function validateCode(userProvidedCode, secretKey) {
    var period = 30;
    var currentTime = Math.floor(Date.now() / 1000);
    var decodedKey = base32Decode(secretKey);
    var generatedCode = generateOneTimeCode(decodedKey, Math.floor(currentTime / period));
    return generatedCode.toString() === userProvidedCode;
}
exports.validateCode = validateCode;
function generateOneTimeCode(key, t) {
    var data = Buffer.alloc(8);
    var value = t;
    for (var i = 7; i >= 0; i--) {
        data[i] = value & 0xff;
        value >>>= 8;
    }
    var signKey = Buffer.from(key);
    var mac = crypto.createHmac("sha1", signKey);
    var hash = mac.update(data).digest();
    var offset = hash[19] & 0xf;
    var truncatedHash = 0;
    for (var i = 0; i < 4; ++i) {
        truncatedHash <<= 8;
        truncatedHash |= hash[offset + i] & 0xff;
    }
    truncatedHash &= 0x7fffffff;
    truncatedHash %= 1000000;
    return truncatedHash;
}
function base32Decode(encodedString) {
    var base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    var bits = encodedString
        .toUpperCase()
        .split("")
        .map(function (char) { return base32Chars.indexOf(char); })
        .map(function (index) { return index.toString(2).padStart(5, "0"); })
        .join("");
    var chunks = bits.match(/.{1,8}/g);
    if (chunks) {
        var bytes = chunks.map(function (chunk) { return parseInt(chunk, 2); });
        return new Uint8Array(bytes);
    }
    else {
        return new Uint8Array(0);
    }
}
// dogru calistigini kontrol etmek icin asagidaki kodu deneyebilirsiniz.
// Kullanıcıya ait bilgiler
var userEmail = "furkanilhanresmi@gmail.com";
// Yeni bir gizli anahtar oluştur
var secretKey = generateSecretKey();
// QR kod oluştur ve göster
createQrCode(userEmail, secretKey, "Balance Network")
    .then(function (qrCode) {
    if (qrCode) {
        console.log("QR Code generated successfully.");
        console.log(qrCode);
    }
    else {
        console.log("Error generating QR Code.");
    }
})
    .catch(function (error) { return console.error("QR Code generation error:", error); });
var isCodeValid = validateCode("Enter_User_Code", secretKey);
if (isCodeValid) {
    console.log("Verification successful. Access granted!");
}
else {
    console.log("Verification failed. Access denied!");
}
