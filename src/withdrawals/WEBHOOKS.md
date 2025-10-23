# Sistema de Webhooks para Withdrawals

Este documento descreve como funcionam os webhooks para o sistema de saques (withdrawals) da plataforma Presente Aí.

## 📋 Visão Geral

Os webhooks são essenciais para receber notificações automáticas dos gateways de pagamento sobre mudanças no status dos saques. Isso permite que o sistema mantenha-se sempre atualizado sobre o estado real das transações.

## 🔗 Endpoints de Webhook

### Stripe
- **URL**: `POST /withdrawals/webhooks/stripe`
- **Autenticação**: Verificação de assinatura via header `stripe-signature`
- **Eventos processados**: `payout.*`

### MercadoPago
- **URL**: `POST /withdrawals/webhooks/mercadopago`
- **Autenticação**: Verificação de assinatura via header `x-signature`
- **Eventos processados**: `transfer.*`

### Pagar.me
- **URL**: `POST /withdrawals/webhooks/pagarme`
- **Autenticação**: Verificação de assinatura via header `x-hub-signature`
- **Eventos processados**: eventos que contenham `transfer`

### Teste
- **URL**: `POST /withdrawals/webhooks/test`
- **Uso**: Endpoint para testes de desenvolvimento
- **Sem autenticação**: Para facilitar testes

## 🔐 Segurança

### Verificação de Assinatura

Todos os webhooks (exceto o de teste) implementam verificação de assinatura para garantir que as requisições realmente vêm dos gateways:

```typescript
// Exemplo de verificação Stripe
const isValidSignature = await this.withdrawalWebhookService.verifyWebhookSignature(
  WithdrawalGateway.STRIPE,
  JSON.stringify(payload),
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

### Variáveis de Ambiente Necessárias

```bash
# Secrets para verificação de webhooks
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_secret
MERCADOPAGO_WEBHOOK_SECRET=your_mercadopago_secret
PAGARME_WEBHOOK_SECRET=your_pagarme_secret
```

## 📨 Fluxo de Processamento

### 1. Recebimento do Webhook
```
Gateway → Controller → Verificação de Assinatura → Webhook Service
```

### 2. Processamento
1. **Verificar assinatura** - Garante autenticidade
2. **Filtrar eventos** - Só processa eventos relevantes
3. **Encontrar withdrawal** - Busca pelo ID externo
4. **Atualizar status** - Aplica as mudanças
5. **Notificar usuário** - Envia notificação sobre mudança

### 3. Mapeamento de Status

#### Stripe
```typescript
'paid' → WithdrawalStatus.COMPLETED
'pending' → WithdrawalStatus.PROCESSING
'in_transit' → WithdrawalStatus.PROCESSING
'failed' → WithdrawalStatus.FAILED
'canceled' → WithdrawalStatus.FAILED
```

#### MercadoPago
```typescript
'transfer.created' → WithdrawalStatus.PROCESSING
'transfer.updated' → WithdrawalStatus.PROCESSING
'transfer.paid' → WithdrawalStatus.COMPLETED
'transfer.cancelled' → WithdrawalStatus.FAILED
```

#### Pagar.me
```typescript
'processing' → WithdrawalStatus.PROCESSING
'transferred' → WithdrawalStatus.COMPLETED
'failed' → WithdrawalStatus.FAILED
'canceled' → WithdrawalStatus.FAILED
```

## 💡 Exemplos de Uso

### Configurando Webhook no Stripe

```bash
# Criar webhook no Stripe CLI
stripe listen --forward-to localhost:3000/withdrawals/webhooks/stripe

# Ou via Dashboard:
# URL: https://your-domain.com/withdrawals/webhooks/stripe
# Eventos: payout.paid, payout.failed, payout.created
```

### Exemplo de Payload Stripe

```json
{
  "type": "payout.paid",
  "data": {
    "object": {
      "id": "po_1234567890",
      "status": "paid",
      "amount": 50000,
      "currency": "usd",
      "arrival_date": 1703516400,
      "metadata": {
        "withdrawal_id": "123",
        "user_id": "456"
      }
    }
  }
}
```

### Exemplo de Resposta

```json
{
  "success": true
}
```

## 🧪 Testando Webhooks

### 1. Usando o Endpoint de Teste

```bash
curl -X POST http://localhost:3000/withdrawals/webhooks/test \
  -H "Content-Type: application/json" \
  -d '{"test": "data", "message": "Hello webhook"}'
```

### 2. Simulando Webhook Stripe

```bash
curl -X POST http://localhost:3000/withdrawals/webhooks/stripe \
  -H "Content-Type: application/json" \
  -H "stripe-signature: t=1703516400,v1=signature_here" \
  -d '{
    "type": "payout.paid",
    "data": {
      "object": {
        "id": "po_test_123",
        "status": "paid",
        "amount": 50000,
        "currency": "usd"
      }
    }
  }'
```

## 🔍 Monitoramento e Logs

### Logs Importantes

```typescript
// Recebimento
this.logger.log(`Received Stripe webhook: ${payload.type}`);

// Verificação de segurança
this.logger.warn('Invalid Stripe webhook signature');

// Processamento
this.logger.log(`Successfully updated withdrawal ${withdrawal.id} to status ${status}`);

// Erros
this.logger.error(`Failed to process Stripe webhook: ${error.message}`);
```

### Métricas Recomendadas

- **Taxa de sucesso de webhooks** por gateway
- **Tempo de processamento** médio
- **Falhas de verificação de assinatura**
- **Webhooks para withdrawals não encontrados**

## ⚠️ Tratamento de Erros

### Cenários Comuns

1. **Assinatura inválida** → `UnauthorizedException`
2. **Withdrawal não encontrado** → Log warning, retorna sucesso
3. **Erro de processamento** → `BadRequestException`
4. **Evento não relevante** → Ignora, retorna sucesso

### Retry Logic

Os gateways normalmente implementam retry automático para webhooks que retornam erro. Certifique-se de:

- Retornar status 200 para sucessos
- Retornar 4xx para erros do cliente
- Retornar 5xx apenas para erros temporários do servidor

## 🚀 Deploy e Configuração

### 1. Configurar URLs nos Gateways

- **Stripe**: Dashboard → Webhooks → Add endpoint
- **MercadoPago**: Configurações → Webhooks → Nova URL
- **Pagar.me**: Dashboard → Webhooks → Adicionar

### 2. Configurar Secrets

```bash
# No servidor de produção
export STRIPE_WEBHOOK_SECRET="whsec_..."
export MERCADOPAGO_WEBHOOK_SECRET="..."
export PAGARME_WEBHOOK_SECRET="..."
```

### 3. Verificar Conectividade

Certifique-se de que os endpoints estão acessíveis publicamente e retornando corretamente.

## 📚 Documentação Adicional

- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [MercadoPago Webhooks](https://www.mercadopago.com.br/developers/pt/guides/notifications/webhooks)
- [Pagar.me Webhooks](https://docs.pagar.me/docs/webhook-de-postback)

## 🤝 Integração com Notificações

O sistema de webhooks também é responsável por notificar os usuários sobre mudanças de status:

```typescript
// TODO: Integrar com o serviço de notificações
await this.notificationsService.createNotification({
  userId,
  type: NotificationType.WITHDRAWAL_STATUS_UPDATE,
  title: 'Status do Saque Atualizado',
  message: `Seu saque foi ${status.toLowerCase()}`,
  data: { withdrawalId, status }
});
```

Esta integração deve ser implementada quando o módulo de notificações estiver disponível.