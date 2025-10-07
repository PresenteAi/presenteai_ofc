import { Contribution, PaymentMethod, PaymentStatus } from './contribution.entity';

describe('Contribution Entity', () => {
  let contribution: Contribution;

  beforeEach(() => {
    contribution = new Contribution();
    contribution.id = 1;
    contribution.eventGiftId = 1;
    contribution.contributorName = 'João Silva';
    contribution.contributorEmail = 'joao@email.com';
    contribution.amount = 100.00;
    contribution.currency = 'BRL';
    contribution.paymentMethod = PaymentMethod.PIX;
    contribution.paymentStatus = PaymentStatus.PENDING;
    contribution.message = 'Parabéns!';
    contribution.createdAt = new Date();
    contribution.updatedAt = new Date();
  });

  describe('canBeRefunded', () => {
    it('should return true for approved contribution without refund date', () => {
      contribution.paymentStatus = PaymentStatus.APPROVED;
      contribution.refundedAt = undefined;

      expect(contribution.canBeRefunded()).toBe(true);
    });

    it('should return false for pending contribution', () => {
      contribution.paymentStatus = PaymentStatus.PENDING;

      expect(contribution.canBeRefunded()).toBe(false);
    });

    it('should return false for already refunded contribution', () => {
      contribution.paymentStatus = PaymentStatus.APPROVED;
      contribution.refundedAt = new Date();

      expect(contribution.canBeRefunded()).toBe(false);
    });
  });

  describe('isFinalState', () => {
    it('should return true for approved contribution', () => {
      contribution.paymentStatus = PaymentStatus.APPROVED;

      expect(contribution.isFinalState()).toBe(true);
    });

    it('should return true for rejected contribution', () => {
      contribution.paymentStatus = PaymentStatus.REJECTED;

      expect(contribution.isFinalState()).toBe(true);
    });

    it('should return true for refunded contribution', () => {
      contribution.paymentStatus = PaymentStatus.REFUNDED;

      expect(contribution.isFinalState()).toBe(true);
    });

    it('should return false for pending contribution', () => {
      contribution.paymentStatus = PaymentStatus.PENDING;

      expect(contribution.isFinalState()).toBe(false);
    });
  });

  describe('getEffectiveAmount', () => {
    it('should return net amount for approved contribution', () => {
      contribution.paymentStatus = PaymentStatus.APPROVED;
      contribution.netAmount = 92.00;

      expect(contribution.getEffectiveAmount()).toBe(92.00);
    });

    it('should return 0 for pending contribution', () => {
      contribution.paymentStatus = PaymentStatus.PENDING;
      contribution.netAmount = 100.00;

      expect(contribution.getEffectiveAmount()).toBe(0);
    });

    it('should return 0 when net amount is not set', () => {
      contribution.paymentStatus = PaymentStatus.APPROVED;
      contribution.netAmount = undefined;

      expect(contribution.getEffectiveAmount()).toBe(0);
    });
  });

  describe('calculateNetAmount', () => {
    it('should calculate net amount with both platform and gateway fees', () => {
      contribution.amount = 100.00;
      contribution.feePlatform = 5.00;
      contribution.feeGateway = 3.00;

      contribution.calculateNetAmount();

      expect(contribution.netAmount).toBe(92.00);
    });

    it('should calculate net amount with only platform fee', () => {
      contribution.amount = 100.00;
      contribution.feePlatform = 5.00;
      contribution.feeGateway = undefined;

      contribution.calculateNetAmount();

      expect(contribution.netAmount).toBe(95.00);
    });

    it('should use full amount when no fees are present', () => {
      contribution.amount = 100.00;
      contribution.feePlatform = undefined;
      contribution.feeGateway = undefined;

      contribution.calculateNetAmount();

      expect(contribution.netAmount).toBe(100.00);
    });
  });

  describe('approve', () => {
    it('should approve pending contribution with fees', () => {
      contribution.paymentStatus = PaymentStatus.PENDING;
      contribution.amount = 100.00;

      contribution.approve('txn_123456', 5.00, 3.00);

      expect(contribution.paymentStatus).toBe(PaymentStatus.APPROVED);
      expect(contribution.transactionId).toBe('txn_123456');
      expect(contribution.feePlatform).toBe(5.00);
      expect(contribution.feeGateway).toBe(3.00);
      expect(contribution.netAmount).toBe(92.00);
    });

    it('should throw error when trying to approve non-pending contribution', () => {
      contribution.paymentStatus = PaymentStatus.APPROVED;

      expect(() => {
        contribution.approve('txn_123456');
      }).toThrow('Only pending contributions can be approved');
    });
  });

  describe('reject', () => {
    it('should reject pending contribution', () => {
      contribution.paymentStatus = PaymentStatus.PENDING;

      contribution.reject();

      expect(contribution.paymentStatus).toBe(PaymentStatus.REJECTED);
    });

    it('should throw error when trying to reject non-pending contribution', () => {
      contribution.paymentStatus = PaymentStatus.APPROVED;

      expect(() => {
        contribution.reject();
      }).toThrow('Only pending contributions can be rejected');
    });
  });

  describe('refund', () => {
    it('should refund approved contribution', () => {
      contribution.paymentStatus = PaymentStatus.APPROVED;
      contribution.refundedAt = undefined;

      contribution.refund();

      expect(contribution.paymentStatus).toBe(PaymentStatus.REFUNDED);
      expect(contribution.refundedAt).toBeInstanceOf(Date);
    });

    it('should throw error when contribution cannot be refunded', () => {
      contribution.paymentStatus = PaymentStatus.PENDING;

      expect(() => {
        contribution.refund();
      }).toThrow('Contribution cannot be refunded');
    });
  });
});