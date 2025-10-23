# 💳 Transactions Module

Sistema de gerenciamento de transações financeiras para o Presente Aí, responsável pelo processamento de pagamentos através de diferentes gateways.

## 📋 Visão Geral

O módulo `transactions` gerencia o ciclo de vida completo das transações financeiras relacionadas às contribuições dos convidados. Cada contribuição pode gerar uma ou mais transações, dependendo do comportamento do gateway (tentativas de pagamento, falhas, etc.).

### 🎯 Características Principais

- **Múltiplos Gateways**: Suporte para Stripe, MercadoPago, Pagar.me
- **Arquitetura Desacoplada**: Interface genérica para fácil adição de novos gateways
- **Rastreamento Completo**: Histórico detalhado de cada transação
- **Webhooks**: Processamento automático de notificações dos gateways
- **Auditoria**: Metadados completos para análise e debug

## 🏗️ Arquitetura

### Strategy Pattern para Gateways

```typescript
interface PaymentGatewayInterface {
  createTransaction(params: CreateTransactionParams): Promise<GatewayTransactionResponse>;
  checkTransactionStatus(externalId: string): Promise<TransactionStatusResponse>;
  processRefund(externalId: string, amount?: number): Promise<RefundResponse>;
  validateWebhook(signature: string, payload: string): boolean;
  parseWebhookData(payload: any): TransactionWebhookData | null;
}
```

### Fluxo de Estados

```
INITIATED → PROCESSING → PAID
     ↓           ↓        ↓
   FAILED    FAILED   REFUNDED
```

## 📊 Estrutura da Tabela

```sql
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contribution_id INT NOT NULL,
    payment_gateway ENUM('stripe', 'mercadopago', 'pagarme'),
    external_transaction_id VARCHAR(255) UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    fee DECIMAL(10,2) DEFAULT 0.00,
    net_amount DECIMAL(10,2) -- Calculado automaticamente
    status ENUM('initiated', 'processing', 'paid', 'failed', 'refunded'),
    payment_date DATETIME NULL,
    refund_date DATETIME NULL,
    metadata JSON NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);
```

## 🚀 API Endpoints

### Criar Transação
```http
POST /transactions
Content-Type: application/json

{
  "contributionId": 123,
  "paymentGateway": "stripe",
  "amount": 50.00,
  "fee": 2.50,
  "paymentMethodData": {
    "card": {
      "number": "4242424242424242",
      "exp_month": 12,
      "exp_year": 2025,
      "cvc": "123"
    }
  },
  "customer": {
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

### Obter Transação
```http
GET /transactions/1
```

### Atualizar Status (Webhook)
```http
PATCH /transactions/1/status
Content-Type: application/json

{
  "status": "paid",
  "paymentDate": "2023-12-25T10:30:00.000Z",
  "externalTransactionId": "stripe_pi_1234567890",
  "metadata": {
    "gateway_fee": 1.50
  }
}
```

### Listar por Contribuição
```http
GET /transactions/contribution/123
```

### Sincronizar com Gateway
```http
POST /transactions/1/sync
```

### Processar Estorno
```http
POST /transactions/1/refund?amount=25.00&reason=Customer%20request
```

### Webhook Gateway
```http
POST /transactions/webhook/stripe
X-Stripe-Signature: stripe_signature_here
Content-Type: application/json
```

### Estatísticas
```http
GET /transactions/contribution/123/stats
```

## 🔧 Configuração e Uso

### 1. Instalação de Dependências

```bash
# Para produção, instalar SDKs dos gateways
npm install stripe mercadopago pagarme-js
npm install @types/stripe
```

### 2. Configuração de Ambiente

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=TEST-...
MERCADOPAGO_WEBHOOK_SECRET=...

# Pagar.me
PAGARME_API_KEY=ak_test_...
PAGARME_ENCRYPTION_KEY=ek_test_...
```

### 3. Usar o Serviço

```typescript
// Injetar o serviço
constructor(
  private readonly transactionsService: TransactionsService
) {}

// Criar transação
const transaction = await this.transactionsService.createTransaction({
  contributionId: 123,
  paymentGateway: PaymentGateway.STRIPE,
  amount: 50.00,
  paymentMethodData: { /* dados do cartão */ },
  customer: { name: 'João Silva' }
});

// Verificar status
const updated = await this.transactionsService.syncTransactionStatus(transaction.id);

// Processar estorno
const refunded = await this.transactionsService.processRefund(transaction.id);
```

## 🧪 Testes

### Executar Testes Unitários
```bash
npm run test src/transactions
```

### Executar Testes de Integração
```bash
npm run test:e2e -- --testNamePattern=transactions
```

### Coverage
```bash
npm run test:cov src/transactions
```

## 📈 Monitoramento

### Métricas Importantes
- Taxa de sucesso por gateway
- Tempo médio de processamento
- Volume de transações por período
- Taxa de estornos

### Logs Estruturados
```json
{
  "timestamp": "2023-12-25T10:30:00.000Z",
  "level": "info",
  "message": "Transaction created",
  "transactionId": 123,
  "contributionId": 456,
  "gateway": "stripe",
  "amount": 50.00
}
```

## 🔒 Segurança

### Validação de Webhooks
Todos os webhooks são validados usando as assinaturas dos gateways para garantir autenticidade.

### Dados Sensíveis
- Números de cartão nunca são armazenados
- Tokens são criptografados
- Logs não contêm informações sensíveis

### Rate Limiting
Implementar rate limiting nos endpoints de webhook para prevenir ataques.

## 🚨 Tratamento de Erros

### Cenários Comuns
- Gateway indisponível
- Cartão recusado
- Webhook duplicado
- Transação não encontrada

### Retry Strategy
- Exponential backoff para APIs de gateway
- Dead letter queue para webhooks falhados
- Circuit breaker para proteger against cascading failures

## 🔄 Integração com Contributions

O módulo mantém sincronização com o `payment_status` da contribuição:

```typescript
// Quando transação é aprovada
contribution.paymentStatus = PaymentStatus.APPROVED;

// Quando transação falha
contribution.paymentStatus = PaymentStatus.REJECTED;

// Quando transação é estornada
contribution.paymentStatus = PaymentStatus.REFUNDED;
```

## 📚 Próximos Passos

### Funcionalidades Futuras
- [ ] Pagamento parcelado
- [ ] Assinatura/recorrência
- [ ] Multi-tenancy por evento
- [ ] Analytics dashboard
- [ ] Reconciliação automática

### Melhorias Técnicas
- [ ] Cache Redis para consultas frequentes
- [ ] Queue para processamento assíncrono
- [ ] GraphQL subscriptions para updates real-time
- [ ] Backup automático de metadados críticos

---

## 📞 Suporte

Para dúvidas ou problemas com o módulo de transações, consulte:
- [Documentação da API](./docs/api.md)
- [Guia de Troubleshooting](./docs/troubleshooting.md)
- [Gateway Integration Guides](./docs/gateways/)