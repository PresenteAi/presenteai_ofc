import { Injectable, Logger } from '@nestjs/common';

export interface NotificationEmailData {
  id: number;
  userId: number;
  title: string;
  message: string;
  templateId?: string;
  templateData?: Record<string, any>;
}

@Injectable()
export class EmailNotificationProvider {
  private readonly logger = new Logger(EmailNotificationProvider.name);

  /**
   * Send notification via email
   */
  async sendNotification(notification: NotificationEmailData): Promise<void> {
    this.logger.log(`Sending email notification ${notification.id} to user ${notification.userId}`);

    try {
      // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
      await this.mockEmailSend(notification);
      
      this.logger.log(`Email notification ${notification.id} sent successfully`);
    } catch (error) {
      this.logger.error(`Failed to send email notification ${notification.id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Mock email sending (replace with real implementation)
   */
  private async mockEmailSend(notification: NotificationEmailData): Promise<void> {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Mock email template selection
    const template = this.getEmailTemplate(notification.templateId || 'default');
    
    const emailContent = {
      to: `user-${notification.userId}@example.com`, // TODO: Get real user email
      subject: notification.title,
      html: this.renderTemplate(template, {
        title: notification.title,
        message: notification.message,
        ...notification.templateData,
      }),
    };

    // Log mock email (in production, this would call actual email service)
    this.logger.debug('Mock email sent:', JSON.stringify(emailContent, null, 2));

    // Simulate random failures for testing (disabled for tests)
    // if (Math.random() < 0.05) { // 5% failure rate
    //   throw new Error('Mock email service temporary failure');
    // }
  }

  /**
   * Get email template by ID
   */
  private getEmailTemplate(templateId: string): string {
    const templates = {
      default: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">{{title}}</h1>
          </div>
          <div style="padding: 20px; background: #f8f9fa;">
            <p style="color: #333; font-size: 16px; line-height: 1.6;">{{message}}</p>
            <div style="margin-top: 30px; text-align: center;">
              <a href="{{appUrl}}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                Ver no App
              </a>
            </div>
          </div>
          <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>Você está recebendo este email porque tem uma conta no Presente Aí</p>
            <p><a href="{{unsubscribeUrl}}">Cancelar inscrição</a></p>
          </div>
        </div>
      `,
      
      contribution_received: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #28a745; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🎉 Nova Contribuição!</h1>
          </div>
          <div style="padding: 20px; background: #f8f9fa;">
            <h2 style="color: #333;">Olá, {{userName}}!</h2>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">{{message}}</p>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="margin: 0 0 10px 0; color: #333;">Detalhes da Contribuição</h3>
              <p style="margin: 5px 0;"><strong>Valor:</strong> R$ {{amount}}</p>
              <p style="margin: 5px 0;"><strong>Evento:</strong> {{eventTitle}}</p>
              <p style="margin: 5px 0;"><strong>Data:</strong> {{contributionDate}}</p>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="{{eventUrl}}" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                Ver Evento
              </a>
            </div>
          </div>
        </div>
      `,
      
      withdrawal_completed: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #17a2b8; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">✅ Saque Aprovado</h1>
          </div>
          <div style="padding: 20px; background: #f8f9fa;">
            <h2 style="color: #333;">Seu saque foi processado!</h2>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">{{message}}</p>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8;">
              <h3 style="margin: 0 0 10px 0; color: #333;">Detalhes do Saque</h3>
              <p style="margin: 5px 0;"><strong>Valor:</strong> R$ {{amount}}</p>
              <p style="margin: 5px 0;"><strong>Data de Processamento:</strong> {{processedDate}}</p>
              <p style="margin: 5px 0;"><strong>Previsão de Crédito:</strong> {{expectedDate}}</p>
            </div>
          </div>
        </div>
      `,
      
      withdrawal_failed: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc3545; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">❌ Saque Rejeitado</h1>
          </div>
          <div style="padding: 20px; background: #f8f9fa;">
            <h2 style="color: #333;">Problema com seu saque</h2>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">{{message}}</p>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <h3 style="margin: 0 0 10px 0; color: #856404;">O que fazer agora?</h3>
              <ul style="color: #856404; margin: 0; padding-left: 20px;">
                <li>Verifique os dados da sua conta bancária</li>
                <li>Entre em contato com nosso suporte</li>
                <li>Tente novamente após corrigir as informações</li>
              </ul>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="{{supportUrl}}" style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                Falar com Suporte
              </a>
            </div>
          </div>
        </div>
      `,
    };

    return templates[templateId] || templates.default;
  }

  /**
   * Render template with data
   */
  private renderTemplate(template: string, data: Record<string, any>): string {
    let rendered = template;
    
    // Replace template variables
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      rendered = rendered.replace(placeholder, String(value || ''));
    });

    // Add default values
    rendered = rendered.replace(/{{appUrl}}/g, 'https://presenteai.com.br');
    rendered = rendered.replace(/{{unsubscribeUrl}}/g, 'https://presenteai.com.br/unsubscribe');
    rendered = rendered.replace(/{{supportUrl}}/g, 'https://presenteai.com.br/support');

    return rendered;
  }

  /**
   * Validate email configuration
   */
  async validateConfiguration(): Promise<boolean> {
    try {
      // TODO: Validate actual email service configuration
      this.logger.log('Email configuration validated (mock)');
      return true;
    } catch (error) {
      this.logger.error(`Email configuration invalid: ${error.message}`);
      return false;
    }
  }

  /**
   * Send test email
   */
  async sendTestEmail(to: string): Promise<boolean> {
    try {
      const testNotification = {
        id: 0,
        userId: 0,
        title: 'Test Email from Presente Aí',
        message: 'This is a test email to verify email delivery is working correctly.',
        templateId: 'default',
        templateData: {
          userName: 'Test User',
        },
      };

      await this.sendNotification(testNotification);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send test email: ${error.message}`);
      return false;
    }
  }
}