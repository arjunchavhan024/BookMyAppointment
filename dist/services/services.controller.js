"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const services_service_1 = require("./services.service");
const create_service_dto_1 = require("./dto/create-service.dto");
const service_entity_1 = require("./entities/service.entity");
let ServicesController = class ServicesController {
    constructor(servicesService) {
        this.servicesService = servicesService;
    }
    create(createServiceDto) {
        return this.servicesService.create(createServiceDto);
    }
    findAll() {
        return this.servicesService.findAll();
    }
};
exports.ServicesController = ServicesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new service' }),
    (0, swagger_1.ApiBody)({ type: create_service_dto_1.CreateServiceDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Service successfully created',
        type: service_entity_1.Service,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_dto_1.CreateServiceDto]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all services' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of all services',
        type: [service_entity_1.Service],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "findAll", null);
exports.ServicesController = ServicesController = __decorate([
    (0, swagger_1.ApiTags)('services'),
    (0, common_1.Controller)('services'),
    __metadata("design:paramtypes", [services_service_1.ServicesService])
], ServicesController);
//# sourceMappingURL=services.controller.js.map