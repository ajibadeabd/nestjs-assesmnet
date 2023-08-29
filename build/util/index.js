"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    HttpResponse: function() {
        return HttpResponse;
    },
    calculateRenewalAndExpiration: function() {
        return calculateRenewalAndExpiration;
    },
    encrypt: function() {
        return encrypt;
    },
    decrypt: function() {
        return decrypt;
    }
});
const _common = require("@nestjs/common");
const _cryptojs = /*#__PURE__*/ _interop_require_wildcard(require("crypto-js"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
let HttpResponse = class HttpResponse {
};
(()=>{
    HttpResponse.ok = (res, data, message, status = _common.HttpStatus.OK)=>{
        return res.status(status).json({
            data,
            message
        });
    };
})();
(()=>{
    HttpResponse.created = (res, data, message, status = _common.HttpStatus.CREATED)=>{
        return res.status(status).json({
            data,
            message
        });
    };
})();
const calculateRenewalAndExpiration = (billingCycle, currentDate)=>{
    const now = new Date(currentDate);
    if (billingCycle === 'Monthly') {
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const renewalDate = nextMonth.toISOString().split('T')[0];
        const expirationDate = new Date(nextMonth);
        expirationDate.setDate(expirationDate.getDate() - 1).toString().split('T');
        return {
            renewalDate,
            expirationDate,
            startDate: now
        };
    } else if (billingCycle === 'Annually') {
        const nextYear = new Date(now);
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        const renewalDate = nextYear.toISOString().split('T')[0];
        // Expiration date is the day before renewal date
        const expirationDate = new Date(nextYear);
        expirationDate.setDate(expirationDate.getDate() - 1).toString().split('T')[0];
        return {
            renewalDate,
            expirationDate,
            startDate: nextYear
        };
    }
};
const encrypt = (data, secretKey)=>{
    // return CryptoJS.AES.encrypt(data, secretKey).toString();
    console.log({
        secretKey
    });
    return _cryptojs.AES.encrypt(JSON.stringify({
        data
    }), 'secretKey').toString();
};
const decrypt = (encryptedData, secretKey)=>{
    console.log({
        secretKey
    });
    // const decrypted = CryptoJS.AES.decrypt(encryptedData, secretKey);
    // return decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(_cryptojs.AES.decrypt(encryptedData, 'secretKey').toString(_cryptojs.enc.Utf8)).data;
};
