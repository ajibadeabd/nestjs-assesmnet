"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DatabaseService", {
    enumerable: true,
    get: function() {
        return DatabaseService;
    }
});
const _common = require("@nestjs/common");
const _pg = require("pg");
const _config = require("@nestjs/config");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let DatabaseService = class DatabaseService {
    async onModuleInit() {
        try {
            this.poolClient = await this.pool.connect();
            console.log('Database connection established');
        } catch (error) {
            console.error('Error establishing database connection:', error);
        }
    }
    async query(sql, params) {
        return await this.poolClient.query(sql, params);
    }
    async closePool() {
        await this.poolClient.release();
        await this.pool.end();
    }
    constructor(configService){
        this.configService = configService;
        this.pool = new _pg.Pool({
            user: this.configService.get('DB_USER', 'postgres'),
            host: this.configService.get('DB_HOST', 'localhost'),
            database: this.configService.get('DB_NAME', 'mydb'),
            password: this.configService.get('DB_PASSWORD', 'password'),
            port: this.configService.get('DB_PORT', 5432)
        });
    }
};
DatabaseService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], DatabaseService);
