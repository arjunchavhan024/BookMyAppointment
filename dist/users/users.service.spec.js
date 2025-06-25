"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const user_entity_1 = require("./entities/user.entity");
describe('UsersService', () => {
    let service;
    let repository;
    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                users_service_1.UsersService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(user_entity_1.User),
                    useValue: mockRepository,
                },
            ],
        }).compile();
        service = module.get(users_service_1.UsersService);
        repository = module.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('create', () => {
        const createUserDto = {
            name: 'John Doe',
            email: 'john@example.com',
        };
        it('should create a user successfully', async () => {
            const savedUser = { id: '1', ...createUserDto, createdAt: new Date() };
            mockRepository.findOne.mockResolvedValue(null);
            mockRepository.create.mockReturnValue(savedUser);
            mockRepository.save.mockResolvedValue(savedUser);
            const result = await service.create(createUserDto);
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { email: createUserDto.email },
            });
            expect(repository.create).toHaveBeenCalledWith(createUserDto);
            expect(repository.save).toHaveBeenCalledWith(savedUser);
            expect(result).toEqual(savedUser);
        });
        it('should throw ConflictException when email already exists', async () => {
            const existingUser = { id: '1', ...createUserDto, createdAt: new Date() };
            mockRepository.findOne.mockResolvedValue(existingUser);
            await expect(service.create(createUserDto)).rejects.toThrow(common_1.ConflictException);
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { email: createUserDto.email },
            });
            expect(repository.create).not.toHaveBeenCalled();
            expect(repository.save).not.toHaveBeenCalled();
        });
    });
    describe('findAll', () => {
        it('should return an array of users', async () => {
            const users = [
                { id: '1', name: 'John Doe', email: 'john@example.com', createdAt: new Date() },
                { id: '2', name: 'Jane Doe', email: 'jane@example.com', createdAt: new Date() },
            ];
            mockRepository.find.mockResolvedValue(users);
            const result = await service.findAll();
            expect(repository.find).toHaveBeenCalledWith({
                order: { createdAt: 'DESC' },
            });
            expect(result).toEqual(users);
        });
    });
    describe('findOne', () => {
        it('should return a user with appointments', async () => {
            const user = {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                createdAt: new Date(),
                appointments: [],
            };
            mockRepository.findOne.mockResolvedValue(user);
            const result = await service.findOne('1');
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id: '1' },
                relations: ['appointments'],
            });
            expect(result).toEqual(user);
        });
    });
});
//# sourceMappingURL=users.service.spec.js.map