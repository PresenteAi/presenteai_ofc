# Contributions Module

## Overview

The Contributions module manages all payment contributions made by guests towards specific gifts in events. It provides comprehensive functionality for contribution creation, payment processing, status management, and financial tracking.

## Architecture

### Entity: `Contribution`
- **Database Table**: `contributions`
- **Primary Key**: `id` (auto-increment integer)
- **Soft Delete**: Supports logical deletion via `deleted_at` timestamp
- **Relationships**: Many-to-One with `GiftEvent`

### Core Components

1. **ContributionEntity** - Database entity with business logic methods
2. **ContributionsService** - Business logic and database operations
3. **ContributionsController** - REST API endpoints
4. **DTOs** - Data transfer objects with validation

## Features

### Payment Status Lifecycle
```
PENDING → APPROVED / REJECTED
APPROVED → REFUNDED
```

### Payment Methods Supported
- Credit Card (`credit_card`)
- Boleto (`boleto`)  
- PIX (`pix`)

### Business Rules

#### Contribution Creation
- Must reference an existing and active gift event
- Gift must be able to receive contributions (not completed)
- Starts with `PENDING` status
- Can be made by registered users or anonymous guests

#### Status Updates
- **Approval**: Requires transaction ID, updates gift's collected value
- **Rejection**: Only pending contributions can be rejected
- **Refund**: Only approved contributions can be refunded

#### Gift Value Synchronization
- Approved contributions add to gift's `collected_value`
- Refunded contributions subtract from gift's `collected_value`
- Auto-completion when collected value reaches gift's effective value

### Fee Structure
- **Platform Fee**: Platform commission
- **Gateway Fee**: Payment gateway commission
- **Net Amount**: Amount after all fees (what actually impacts gift value)

## API Endpoints

### Create Contribution
```http
POST /contributions
```
Creates a new contribution for a gift event.

### List Contributions
```http
GET /contributions?eventGiftId=1&paymentStatus=approved&page=1&limit=20
```
Retrieves paginated list with optional filters.

### Get Gift Contributions
```http
GET /contributions/gift-event/{eventGiftId}
```
Gets all contributions for a specific gift event.

### Get Contribution Statistics
```http
GET /contributions/gift-event/{eventGiftId}/stats
```
Returns financial statistics for a gift event.

### Get Contribution Details
```http
GET /contributions/{id}
```
Retrieves detailed information about a specific contribution.

### Update Payment Status
```http
PATCH /contributions/{id}/status
```
Updates contribution payment status (for payment gateway webhooks).

### Delete Contribution
```http
DELETE /contributions/{id}
```
Soft deletes a pending contribution.

## Database Schema

```sql
CREATE TABLE contributions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_gift_id INT NOT NULL,
  user_id INT NULL,
  contributor_name VARCHAR(255) NOT NULL,
  contributor_email VARCHAR(255) NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  payment_method ENUM('credit_card','boleto','pix') NOT NULL,
  payment_status ENUM('pending','approved','rejected','refunded') DEFAULT 'pending',
  transaction_id VARCHAR(255) NULL UNIQUE,
  fee_platform DECIMAL(10,2) NULL,
  fee_gateway DECIMAL(10,2) NULL,
  net_amount DECIMAL(10,2) NULL,
  message TEXT NULL,
  refunded_at TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (event_gift_id) REFERENCES gift_events(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  
  INDEX idx_event_gift_status (event_gift_id, payment_status),
  INDEX idx_contributor_email (contributor_email),
  UNIQUE INDEX idx_transaction_id (transaction_id) WHERE transaction_id IS NOT NULL
);
```

## Usage Examples

### Creating a Contribution
```typescript
const contribution = await contributionsService.create({
  eventGiftId: 1,
  userId: 123, // Optional for anonymous contributions
  contributorName: 'João Silva',
  contributorEmail: 'joao@email.com',
  amount: 150.00,
  currency: 'BRL',
  paymentMethod: PaymentMethod.PIX,
  message: 'Parabéns pelo casamento!'
});
```

### Approving a Payment
```typescript
const approvedContribution = await contributionsService.updateStatus(1, {
  paymentStatus: PaymentStatus.APPROVED,
  transactionId: 'pix_123456789',
  feePlatform: 7.50,
  feeGateway: 4.50
});
```

### Processing a Refund
```typescript
const refundedContribution = await contributionsService.updateStatus(1, {
  paymentStatus: PaymentStatus.REFUNDED
});
```

## Testing

The module includes comprehensive test coverage:

- **Entity Tests**: Business logic methods and validation
- **Service Tests**: Database operations and transaction handling
- **Controller Tests**: REST API endpoint functionality
- **Integration Tests**: End-to-end workflow testing

### Running Tests
```bash
npm test -- --testPathPattern="contributions"
```

## Error Handling

### Common Exceptions
- `NotFoundException`: Contribution or gift event not found
- `BadRequestException`: Invalid status transitions, business rule violations
- `ConflictException`: Duplicate transaction IDs

### Validation
- Amount must be positive
- Email format validation
- Enum validation for payment methods and status
- Maximum length constraints for text fields

## Security Considerations

### Authentication
- All endpoints require JWT authentication
- Rate limiting recommended for contribution creation

### Data Privacy
- Contributor emails are optional and encrypted at rest
- Transaction IDs are unique but not publicly exposed
- Soft delete preserves audit trail

### Payment Security
- Never store sensitive payment data (card numbers, etc.)
- Only store payment gateway transaction references
- Validate webhook signatures from payment providers

## Integration Points

### Payment Gateways
- Webhooks for status updates
- Transaction ID mapping
- Fee calculation integration

### Gift Events Module
- Automatic collected value updates
- Completion status synchronization
- Contribution eligibility validation

### Notifications Module
- Payment confirmation emails
- Refund notifications
- Completion alerts

## Performance Considerations

### Database Optimization
- Indexed columns for frequent queries
- Efficient pagination for large datasets
- Query optimization for statistics calculations

### Caching Strategy
- Cache contribution statistics
- Redis for frequently accessed data
- Background job for heavy calculations

### Monitoring
- Payment success/failure rates
- Average processing times
- Error rate tracking
- Financial reconciliation alerts