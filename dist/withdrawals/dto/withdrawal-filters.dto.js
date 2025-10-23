"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalFiltersDto = void 0;
class WithdrawalFiltersDto {
    status;
    paymentGateway;
    startDate;
    endDate;
    minAmount;
    maxAmount;
    userSearch;
    page = 1;
    limit = 10;
    sortBy = 'requestedAt';
    sortOrder = 'DESC';
}
exports.WithdrawalFiltersDto = WithdrawalFiltersDto;
//# sourceMappingURL=withdrawal-filters.dto.js.map