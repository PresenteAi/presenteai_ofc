# 🚨 Transactions Troubleshooting Guide

Guia para resolução de problemas comuns no módulo de transações do Presente Aí.

## 📋 Problemas Comuns

### 1. Transação Travada em "INITIATED"

**Sintomas:**
- Transação criada mas nunca avança para PROCESSING
- Gateway não recebe a requisição

**Possíveis Causas:**
- Gateway indisponível
- Credenciais incorretas
- Dados de pagamento inválidos
- Rate limiting do gateway

**Soluções:**

```typescript
// 1. Verificar status do gateway
await transactionService.syncTransactionStatus(transactionId);

// 2. Verificar logs do aplicação
grep -r "Gateway.*error" logs/

// 3. Testar conectividade
curl -X POST https://api.stripe.com/v1/payment_intents \
  -H "Authorization: Bearer sk_test_..." \
  -d "amount=1000" \
  -d "currency=brl"
```

### 2. Webhook Não Processado

**Sintomas:**
- Pagamento aprovado no gateway mas transação ainda em PROCESSING
- Logs mostram webhook recebido mas não processado

**Diagnóstico:**

```bash
# Verificar logs de webhook
grep -r "webhook.*stripe" logs/app.log

# Verificar assinatura
curl -X POST /transactions/webhook/stripe \
  -H "X-Stripe-Signature: valid_signature" \
  -H "Content-Type: application/json" \
  -d '{"type":"payment_intent.succeeded",...}'
```

**Soluções:**

```typescript
// 1. Validar assinatura do webhook
const isValid = gatewayService.validateWebhook(signature, payload);
if (!isValid) {
  throw new BadRequestException('Invalid webhook signature');
}

// 2. Reprocessar webhook manualmente
const result = await transactionService.handleWebhook(
  signature, 
  payload, 
  'stripe'
);

// 3. Sincronizar status manualmente
await transactionService.syncTransactionStatus(transactionId);
```

### 3. Transação Duplicada

**Sintomas:**
- Múltiplas transações para a mesma contribuição
- Cliente cobrado mais de uma vez

**Prevenção:**

```typescript
// Implementar idempotência
const existingTransaction = await repository.findOne({
  where: {
    contributionId,
    externalTransactionId,
    status: Not(TransactionStatus.FAILED)
  }
});

if (existingTransaction) {
  return existingTransaction;
}
```

### 4. Erro de Timeout

**Sintomas:**
- Timeout ao criar transação
- Gateway responde lentamente

**Soluções:**

```typescript
// Configurar timeout adequado
const axiosConfig = {
  timeout: 30000, // 30 segundos
  retry: 3,
  retryDelay: (retryCount) => retryCount * 1000
};

// Implementar circuit breaker
class CircuitBreaker {
  private failures = 0;
  private readonly threshold = 5;
  private readonly timeout = 60000;
  
  async call(fn: Function) {
    if (this.failures >= this.threshold) {
      throw new Error('Circuit breaker is open');
    }
    
    try {
      const result = await fn();
      this.failures = 0;
      return result;
    } catch (error) {
      this.failures++;
      throw error;
    }
  }
}
```

## 🔍 Ferramentas de Debug

### 1. Logs Estruturados

```typescript
// Adicionar ao logger
this.logger.log({
  event: 'transaction_created',
  transactionId: transaction.id,
  contributionId: transaction.contributionId,
  gateway: transaction.paymentGateway,
  amount: transaction.amount,
  timestamp: new Date().toISOString()
});
```

### 2. Health Check

```typescript
@Get('health')
async healthCheck() {
  const checks = await Promise.allSettled([
    this.checkStripeConnection(),
    this.checkMercadoPagoConnection(),
    this.checkDatabaseConnection(),
  ]);
  
  return {
    status: checks.every(c => c.status === 'fulfilled') ? 'healthy' : 'unhealthy',
    checks: checks.map((c, i) => ({
      service: ['stripe', 'mercadopago', 'database'][i],
      status: c.status,
      error: c.status === 'rejected' ? c.reason : null
    }))
  };
}
```

### 3. Monitoramento de Métricas

```typescript
// Prometheus metrics
import { Counter, Histogram, register } from 'prom-client';

const transactionCounter = new Counter({
  name: 'transactions_total',
  help: 'Total number of transactions',
  labelNames: ['gateway', 'status']
});

const transactionDuration = new Histogram({
  name: 'transaction_duration_seconds',
  help: 'Transaction processing duration',
  labelNames: ['gateway']
});

// Uso
transactionCounter.inc({ gateway: 'stripe', status: 'success' });
transactionDuration.observe({ gateway: 'stripe' }, duration);
```

## 🛠️ Comandos Úteis

### Database Queries

```sql
-- Transações orfãs (sem contribuição)
SELECT t.* FROM transactions t 
LEFT JOIN contributions c ON t.contribution_id = c.id 
WHERE c.id IS NULL;

-- Transações antigas em processamento
SELECT * FROM transactions 
WHERE status IN ('initiated', 'processing') 
AND created_at < DATE_SUB(NOW(), INTERVAL 1 HOUR);

-- Estatísticas por gateway
SELECT 
  payment_gateway,
  status,
  COUNT(*) as count,
  AVG(amount) as avg_amount
FROM transactions 
GROUP BY payment_gateway, status;
```

### API Testing

```bash
# Criar transação de teste
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "contributionId": 123,
    "paymentGateway": "stripe",
    "amount": 50.00,
    "paymentMethodData": {"test": true}
  }'

# Verificar status
curl http://localhost:3000/transactions/1

# Simular webhook
curl -X POST http://localhost:3000/transactions/webhook/stripe \
  -H "X-Stripe-Signature: test_signature" \
  -H "Content-Type: application/json" \
  -d '{"type":"payment_intent.succeeded","data":{"object":{"id":"pi_test"}}}'
```

## 📊 Dashboard de Monitoramento

### Métricas Importantes

1. **Taxa de Sucesso por Gateway**
   ```sql
   SELECT 
     payment_gateway,
     (COUNT(CASE WHEN status = 'paid' THEN 1 END) * 100.0 / COUNT(*)) as success_rate
   FROM transactions 
   WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
   GROUP BY payment_gateway;
   ```

2. **Tempo Médio de Processamento**
   ```sql
   SELECT 
     payment_gateway,
     AVG(TIMESTAMPDIFF(SECOND, created_at, updated_at)) as avg_processing_time
   FROM transactions 
   WHERE status = 'paid'
   GROUP BY payment_gateway;
   ```

3. **Volume de Transações por Hora**
   ```sql
   SELECT 
     DATE_FORMAT(created_at, '%Y-%m-%d %H:00') as hour,
     COUNT(*) as transaction_count,
     SUM(amount) as total_amount
   FROM transactions 
   WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
   GROUP BY hour
   ORDER BY hour;
   ```

### Alertas Recomendados

```typescript
// Taxa de falha alta
if (failureRate > 0.05) { // 5%
  await this.sendAlert('High failure rate', {
    rate: failureRate,
    gateway,
    threshold: 0.05
  });
}

// Transações antigas
const staleTransactions = await this.repository.findStaleTransactions(30);
if (staleTransactions.length > 0) {
  await this.sendAlert('Stale transactions detected', {
    count: staleTransactions.length
  });
}

// Gateway indisponível
try {
  await gatewayService.healthCheck();
} catch (error) {
  await this.sendAlert('Gateway unavailable', {
    gateway,
    error: error.message
  });
}
```

## 📝 Checklist de Troubleshooting

### Antes de Investigar
- [ ] Verificar logs da aplicação
- [ ] Confirmar status do gateway (status page)
- [ ] Validar credenciais e configurações
- [ ] Verificar conectividade de rede

### Durante a Investigação
- [ ] Reproduzir o problema em ambiente de teste
- [ ] Verificar transações similares bem-sucedidas
- [ ] Analisar timing e sequência de eventos
- [ ] Verificar metadados da transação

### Após a Resolução
- [ ] Documentar a causa raiz
- [ ] Implementar monitoramento para prevenir recorrência
- [ ] Atualizar alertas se necessário
- [ ] Comunicar resolução aos stakeholders

## 🆘 Contatos de Emergência

- **Gateway Issues**: Suporte técnico do gateway
- **Database Issues**: DBA ou DevOps
- **Application Issues**: Desenvolvedor responsável
- **Business Issues**: Product Owner

---

**Lembrete**: Sempre verificar logs estruturados primeiro, eles geralmente contêm a informação necessária para identificar a causa raiz rapidamente.