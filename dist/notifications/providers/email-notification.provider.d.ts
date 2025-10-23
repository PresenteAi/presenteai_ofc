export interface NotificationEmailData {
    id: number;
    userId: number;
    title: string;
    message: string;
    templateId?: string;
    templateData?: Record<string, any>;
}
export declare class EmailNotificationProvider {
    private readonly logger;
    sendNotification(notification: NotificationEmailData): Promise<void>;
    private mockEmailSend;
    private getEmailTemplate;
    private renderTemplate;
    validateConfiguration(): Promise<boolean>;
    sendTestEmail(to: string): Promise<boolean>;
}
