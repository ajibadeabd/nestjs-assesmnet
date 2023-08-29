"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BrokerModule", {
    enumerable: true,
    get: function() {
        return BrokerModule;
    }
});
const _common = require("@nestjs/common");
const _microservices = require("@nestjs/microservices");
const _messageservice = require("./message.service");
const _messagecontroller = require("./message.controller");
const _databasemodule = require("../databaseFactory/database.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let BrokerModule = class BrokerModule {
};
BrokerModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _microservices.ClientsModule.register([
                {
                    name: 'BROKER_SERVICES_CLIENT',
                    transport: _microservices.Transport.RMQ,
                    options: {
                        urls: [
                            process.env.RABBIT_MQ_HOSTS
                        ],
                        queue: 'salla_billing_queue',
                        queueOptions: {
                            durable: false
                        }
                    }
                }
            ]),
            _databasemodule.DatabaseModule
        ],
        controllers: [
            _messagecontroller.BrokerController
        ],
        providers: [
            _messageservice.BrokerService
        ],
        exports: [
            _messageservice.BrokerService
        ]
    })
], BrokerModule);
