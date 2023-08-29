"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserDataFactory", {
    enumerable: true,
    get: function() {
        return UserDataFactory;
    }
});
const _common = require("@nestjs/common");
const _dbPool = require("./dbPool");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UserDataFactory = class UserDataFactory {
    async getUser(queryParameters, excludeProperties = false, subscriptions = false) {
        const select = excludeProperties ? 'users.id, name, email, users.created_at, users.updated_at' : 'users.*';
        const keys = Object.keys(queryParameters);
        const conditions = keys.map((key, index)=>`${key} = $${index + 1}`).join(' AND ');
        const values = keys.map((key)=>queryParameters[key]);
        let query = `
      SELECT ${select}
      FROM users
      WHERE ${conditions};
      
    `;
        if (subscriptions) {
            query = `
              SELECT users.*,
              (
              SELECT json_agg(subscriptions)
              FROM subscriptions
              WHERE subscriptions.user_id = users.id
              ) AS subscriptions
              FROM users
              LEFT JOIN subscriptions ON users.id = subscriptions.user_id
              WHERE users.id = $1
              GROUP BY users.id;
              `;
        }
        const response = await this.databaseService.query(query, values);
        return response.rows[0];
    }
    async createUser(createUserDto) {
        const query = `
    INSERT INTO users ( name, email, password, updated_at)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, updated_at;
  `;
        const values = [
            createUserDto.name,
            createUserDto.email,
            createUserDto.password,
            new Date()
        ];
        try {
            const response = await this.databaseService.query(query, values);
            return response.rows[0];
        } catch (error) {
            throw error;
        }
    }
    async updateUserDetails(planId, email) {
        try {
            const query = `
    UPDATE users
    SET plan_id = $1, updated_at = $2
    WHERE email = $3
    RETURNING id;
  `;
            const values = [
                planId,
                new Date(),
                email
            ];
            const response = await this.databaseService.query(query, values);
            return response.rows[0];
        } catch (error) {}
    }
    constructor(databaseService){
        this.databaseService = databaseService;
    }
};
UserDataFactory = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _dbPool.DatabaseService === "undefined" ? Object : _dbPool.DatabaseService
    ])
], UserDataFactory);
