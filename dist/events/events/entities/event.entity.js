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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.EventType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../../users/users/entities/user.entity");
var EventType;
(function (EventType) {
    EventType["WEDDING"] = "wedding";
    EventType["BABY_SHOWER"] = "baby_shower";
    EventType["HOUSEWARMING"] = "housewarming";
    EventType["BIRTHDAY"] = "birthday";
    EventType["GRADUATION"] = "graduation";
    EventType["ANNIVERSARY"] = "anniversary";
    EventType["OTHER"] = "other";
})(EventType || (exports.EventType = EventType = {}));
let Event = class Event {
    id;
    userId;
    title;
    description;
    eventType;
    coverImageUrl;
    primaryColor;
    secondaryColor;
    tertiaryColor;
    fontFamily;
    startDate;
    endDate;
    publicUrl;
    isPublished;
    isActive;
    createdAt;
    updatedAt;
    user;
};
exports.Event = Event;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-string', description: 'Unique identifier of the event' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Event.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-string', description: 'Reference to the event organizer' }),
    (0, typeorm_1.Column)({ type: 'uuid', name: 'user_id' }),
    __metadata("design:type", String)
], Event.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Casamento Ana & João', description: 'Event title' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Event.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Venham celebrar conosco este momento especial!',
        description: 'Event description or host message',
        required: false
    }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'wedding',
        description: 'Type of event',
        enum: EventType
    }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EventType,
        name: 'event_type'
    }),
    __metadata("design:type", String)
], Event.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/cover.jpg',
        description: 'Cover image URL',
        required: false
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true, name: 'cover_image_url' }),
    __metadata("design:type", String)
], Event.prototype, "coverImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '#FF6B6B',
        description: 'Primary theme color',
        required: false
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 7, nullable: true, name: 'primary_color' }),
    __metadata("design:type", String)
], Event.prototype, "primaryColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '#4ECDC4',
        description: 'Secondary theme color',
        required: false
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 7, nullable: true, name: 'secondary_color' }),
    __metadata("design:type", String)
], Event.prototype, "secondaryColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '#45B7D1',
        description: 'Tertiary theme color',
        required: false
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 7, nullable: true, name: 'tertiary_color' }),
    __metadata("design:type", String)
], Event.prototype, "tertiaryColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Roboto',
        description: 'Font family used in the event page',
        required: false
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true, name: 'font_family' }),
    __metadata("design:type", String)
], Event.prototype, "fontFamily", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-12-25',
        description: 'Event start date',
        required: false
    }),
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'start_date' }),
    __metadata("design:type", Date)
], Event.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-12-20',
        description: 'Contribution end date',
        required: false
    }),
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'end_date' }),
    __metadata("design:type", Date)
], Event.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'casamento-ana-joao-2025',
        description: 'Unique public URL slug for guests'
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true, name: 'public_url' }),
    __metadata("design:type", String)
], Event.prototype, "publicUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether the event is publicly visible'
    }),
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'is_published' }),
    __metadata("design:type", Boolean)
], Event.prototype, "isPublished", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether the event is active'
    }),
    (0, typeorm_1.Column)({ type: 'boolean', default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], Event.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-10-06T12:00:00Z',
        description: 'Date when the event was created'
    }),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', name: 'created_at' }),
    __metadata("design:type", Date)
], Event.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-10-06T12:00:00Z',
        description: 'Date when the event was last updated'
    }),
    (0, typeorm_1.Column)({
        type: 'timestamp',
        name: 'updated_at',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP'
    }),
    __metadata("design:type", Date)
], Event.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Event.prototype, "user", void 0);
exports.Event = Event = __decorate([
    (0, typeorm_1.Entity)('events')
], Event);
//# sourceMappingURL=event.entity.js.map