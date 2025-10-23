export declare enum NotificationType {
    SYSTEM = "system",
    PAYMENT = "payment",
    EVENT = "event",
    WITHDRAWAL = "withdrawal",
    CONTRIBUTION = "contribution",
    CUSTOM = "custom"
}
export declare enum DeliveryMethod {
    IN_APP = "in_app",
    EMAIL = "email",
    PUSH = "push",
    SMS = "sms"
}
export declare enum NotificationPriority {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high",
    URGENT = "urgent"
}
export declare enum NotificationStatus {
    CREATED = "created",
    PENDING = "pending",
    SENT = "sent",
    DELIVERED = "delivered",
    FAILED = "failed",
    EXPIRED = "expired"
}
export declare class Notification {
    id: number;
    userId: number;
    eventId?: number;
    contributionId?: number;
    withdrawalId?: number;
    transactionId?: number;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    deliveryMethod: DeliveryMethod;
    priority: NotificationPriority;
    status: NotificationStatus;
    sentAt?: Date;
    deliveredAt?: Date;
    expiresAt?: Date;
    metadata?: Record<string, any>;
    templateId?: string;
    templateData?: Record<string, any>;
    retryCount: number;
    maxRetries: number;
    lastError?: string;
    createdAt: Date;
    updatedAt: Date;
    markAsRead(): void;
    markAsSent(): void;
    markAsDelivered(): void;
    markAsFailed(error: string): void;
    canRetry(): boolean;
    isExpired(): boolean;
    shouldBeSent(): boolean;
    toDisplayData(): {
        id: number;
        type: NotificationType;
        title: string;
        message: string;
        isRead: boolean;
        priority: NotificationPriority;
        createdAt: Date;
        metadata: Record<string, any> | undefined;
    };
    setDefaultExpirationDate(): void;
}
