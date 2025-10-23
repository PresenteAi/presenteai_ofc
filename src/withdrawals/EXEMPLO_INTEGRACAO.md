# Exemplo de Integração Completa - Webhooks de Withdrawal

Este arquivo demonstra como implementar uma integração completa com webhooks para o sistema de withdrawals.

## 🚀 Cenário Completo: Saque com Stripe

### 1. Usuário Solicita Saque

```typescript
// Frontend ou API call
const withdrawalRequest = {
  totalAmount: 500.00,
  paymentGateway: 'stripe',
  bankAccount: {
    bankCode: '001',
    bankName: 'Banco do Brasil',
    accountType: 'checking',
    accountNumber: '12345-6',
    agency: '1234',
    accountHolderName: 'João Silva',
    accountHolderDocument: '12345678901'
  }
};

// POST /withdrawals
const response = await fetch('/withdrawals', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer jwt_token_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(withdrawalRequest)
});

const withdrawal = await response.json();
console.log('Withdrawal created:', withdrawal.id, 'Status:', withdrawal.status);
// Output: Withdrawal created: 123 Status: pending
```

### 2. Sistema Processa com Gateway

```typescript
// No WithdrawalsService.createWithdrawal()
async createWithdrawal(userId: number, dto: CreateWithdrawalDto) {
  // 1. Validar saldo disponível
  const balance = await this.getUserBalance(userId);
  if (balance.availableBalance < dto.totalAmount) {
    throw new BadRequestException('Insufficient balance');
  }

  // 2. Criar withdrawal no banco
  const withdrawal = new Withdrawal();
  withdrawal.userId = userId;
  withdrawal.totalAmount = dto.totalAmount;
  withdrawal.status = WithdrawalStatus.PENDING;
  withdrawal.paymentGateway = dto.paymentGateway;
  withdrawal.bankAccount = dto.bankAccount;

  const savedWithdrawal = await this.withdrawalRepository.save(withdrawal);

  // 3. Processar com gateway externo (Stripe)
  try {
    const stripeTransfer = await this.processWithStripe(savedWithdrawal);
    
    // 4. Atualizar com referência externa
    savedWithdrawal.transactionReference = stripeTransfer.id;
    savedWithdrawal.status = WithdrawalStatus.PROCESSING;
    
    return await this.withdrawalRepository.save(savedWithdrawal);
  } catch (error) {
    // Marcar como falhou se gateway rejeitou
    savedWithdrawal.status = WithdrawalStatus.FAILED;
    await this.withdrawalRepository.save(savedWithdrawal);
    throw error;
  }
}

private async processWithStripe(withdrawal: Withdrawal) {
  // Chamar API do Stripe para criar payout
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  
  return await stripe.transfers.create({
    amount: Math.round(withdrawal.totalAmount * 100), // Convert to cents
    currency: 'brl',
    destination: 'acct_stripe_account_id', // Conta de destino
    metadata: {
      withdrawal_id: withdrawal.id,
      user_id: withdrawal.userId,
    }
  });
}
```

### 3. Stripe Processa e Envia Webhook

```bash
# Stripe envia POST para nossa URL configurada
# URL: https://api.presenteai.com/withdrawals/webhooks/stripe
# Header: stripe-signature: t=1703520000,v1=abc123...

curl -X POST https://api.presenteai.com/withdrawals/webhooks/stripe \
  -H "stripe-signature: t=1703520000,v1=hash_da_assinatura" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payout.paid",
    "data": {
      "object": {
        "id": "po_1abc123def456",
        "status": "paid",
        "amount": 50000,
        "currency": "brl",
        "arrival_date": 1703520000,
        "metadata": {
          "withdrawal_id": "123",
          "user_id": "456"
        }
      }
    }
  }'
```

### 4. Sistema Processa Webhook

```typescript
// WithdrawalWebhooksController.handleStripeWebhook()
async handleStripeWebhook(payload: StripeWebhookDto, signature: string) {
  // 1. Verificar autenticidade
  const isValid = await this.webhookService.verifyWebhookSignature(
    WithdrawalGateway.STRIPE,
    JSON.stringify(payload),
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (!isValid) {
    throw new UnauthorizedException('Invalid signature');
  }

  // 2. Só processar eventos de payout
  if (!payload.type.startsWith('payout.')) {
    return { success: true }; // Ignora outros eventos
  }

  // 3. Processar webhook
  await this.webhookService.handleStripeWebhook(payload);
  
  return { success: true };
}

// WithdrawalWebhookService.handleStripeWebhook()
async handleStripeWebhook(payload: StripeWebhookDto) {
  // 1. Encontrar withdrawal pelo ID externo
  const withdrawal = await this.withdrawalsService.findByExternalReference(
    payload.data.object.id,
    WithdrawalGateway.STRIPE
  );

  if (!withdrawal) {
    this.logger.warn(`Withdrawal not found for Stripe ID: ${payload.data.object.id}`);
    return;
  }

  // 2. Mapear status do Stripe para nosso sistema
  const newStatus = this.mapStripeStatus(payload.data.object.status);
  
  // 3. Atualizar withdrawal
  await this.withdrawalsService.updateWithdrawalStatus(withdrawal.id, {
    status: newStatus,
    transactionReference: payload.data.object.id,
    processedAt: new Date(payload.data.object.arrival_date * 1000).toISOString(),
    fees: payload.data.object.amount * 0.025, // 2.5% fee
    metadata: payload.data.object.metadata
  });

  // 4. Notificar usuário
  await this.notifyUser(withdrawal.userId, withdrawal.id, newStatus);
}
```

### 5. Usuário Recebe Notificação

```typescript
// Sistema de notificações (implementação futura)
async notifyUser(userId: number, withdrawalId: number, status: WithdrawalStatus) {
  const notification = {
    userId,
    type: 'WITHDRAWAL_STATUS_UPDATE',
    title: 'Status do Saque Atualizado',
    message: this.getStatusMessage(status),
    data: { withdrawalId, status }
  };

  // Enviar push notification
  await this.pushService.send(userId, notification);
  
  // Enviar email
  await this.emailService.sendWithdrawalStatusUpdate(userId, {
    withdrawalId,
    status,
    message: notification.message
  });
  
  // Salvar no banco para histórico
  await this.notificationsService.create(notification);
}

private getStatusMessage(status: WithdrawalStatus): string {
  switch (status) {
    case WithdrawalStatus.COMPLETED:
      return 'Seu saque foi processado com sucesso! O dinheiro chegará em sua conta em até 1 dia útil.';
    case WithdrawalStatus.PROCESSING:
      return 'Seu saque está sendo processado. Você será notificado quando for concluído.';
    case WithdrawalStatus.FAILED:
      return 'Houve um problema com seu saque. Entre em contato com o suporte.';
    default:
      return 'Status do seu saque foi atualizado.';
  }
}
```

## 📱 Fluxo Completo na Interface

### Frontend - Página de Saques

```typescript
// React/Vue component
function WithdrawalPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    // Buscar saldo disponível
    fetch('/withdrawals/balance', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(setBalance);

    // Buscar histórico de saques
    fetch('/withdrawals', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(setWithdrawals);

    // WebSocket para updates em tempo real
    const ws = new WebSocket('ws://localhost:3000/notifications');
    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      if (notification.type === 'WITHDRAWAL_STATUS_UPDATE') {
        // Atualizar status do saque na interface
        setWithdrawals(prev => 
          prev.map(w => 
            w.id === notification.data.withdrawalId 
              ? { ...w, status: notification.data.status }
              : w
          )
        );
        
        // Mostrar toast notification
        showToast(notification.message);
      }
    };
  }, []);

  const requestWithdrawal = async (amount, bankAccount) => {
    try {
      const response = await fetch('/withdrawals', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          totalAmount: amount,
          paymentGateway: 'stripe',
          bankAccount
        })
      });

      if (response.ok) {
        const newWithdrawal = await response.json();
        setWithdrawals(prev => [newWithdrawal, ...prev]);
        showToast('Saque solicitado com sucesso!');
      }
    } catch (error) {
      showToast('Erro ao solicitar saque');
    }
  };

  return (
    <div>
      <h1>Saques</h1>
      
      {/* Saldo disponível */}
      <div className="balance-card">
        <h2>Saldo Disponível</h2>
        <p>R$ {balance?.availableBalance?.toFixed(2)}</p>
        <small>Saques pendentes: R$ {balance?.pendingWithdrawals?.toFixed(2)}</small>
      </div>

      {/* Formulário de novo saque */}
      <WithdrawalForm onSubmit={requestWithdrawal} />

      {/* Histórico */}
      <div className="withdrawals-history">
        <h3>Histórico de Saques</h3>
        {withdrawals.map(withdrawal => (
          <WithdrawalCard 
            key={withdrawal.id} 
            withdrawal={withdrawal}
            onStatusChange={(newStatus) => {
              // Status atualizado via webhook
            }}
          />
        ))}
      </div>
    </div>
  );
}

function WithdrawalCard({ withdrawal }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'processing': return 'orange';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'processing': return 'Processando';
      case 'failed': return 'Falhou';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  return (
    <div className="withdrawal-card">
      <div className="header">
        <span>Saque #{withdrawal.id}</span>
        <span 
          className={`status ${getStatusColor(withdrawal.status)}`}
        >
          {getStatusText(withdrawal.status)}
        </span>
      </div>
      
      <div className="details">
        <p>Valor: R$ {withdrawal.totalAmount.toFixed(2)}</p>
        <p>Gateway: {withdrawal.paymentGateway}</p>
        <p>Solicitado: {new Date(withdrawal.requestedAt).toLocaleString()}</p>
        {withdrawal.processedAt && (
          <p>Processado: {new Date(withdrawal.processedAt).toLocaleString()}</p>
        )}
      </div>

      {withdrawal.status === 'pending' && (
        <button onClick={() => cancelWithdrawal(withdrawal.id)}>
          Cancelar Saque
        </button>
      )}
    </div>
  );
}
```

## 📈 Monitoramento e Métricas

### Dashboard de Administração

```typescript
// Admin dashboard para monitorar webhooks
function WebhooksDashboard() {
  const [metrics, setMetrics] = useState({
    totalWebhooks: 0,
    successRate: 0,
    avgProcessingTime: 0,
    byGateway: {}
  });

  useEffect(() => {
    // Buscar métricas de webhooks
    fetch('/admin/webhooks/metrics')
      .then(res => res.json())
      .then(setMetrics);
  }, []);

  return (
    <div>
      <h1>Webhooks Dashboard</h1>
      
      <div className="metrics-grid">
        <MetricCard 
          title="Total Webhooks (24h)"
          value={metrics.totalWebhooks}
        />
        <MetricCard 
          title="Taxa de Sucesso"
          value={`${metrics.successRate}%`}
        />
        <MetricCard 
          title="Tempo Médio"
          value={`${metrics.avgProcessingTime}ms`}
        />
      </div>

      <div className="gateway-breakdown">
        <h3>Por Gateway</h3>
        {Object.entries(metrics.byGateway).map(([gateway, data]) => (
          <div key={gateway}>
            <h4>{gateway}</h4>
            <p>Sucessos: {data.success}</p>
            <p>Falhas: {data.failures}</p>
            <p>Taxa: {data.rate}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## ✅ Resumo da Integração

Este exemplo demonstra:

1. **Solicitação de Saque** - Usuário cria withdrawal via API
2. **Processamento** - Sistema valida e envia para gateway
3. **Webhook Automático** - Gateway notifica mudanças de status
4. **Atualização em Tempo Real** - Sistema atualiza status e notifica usuário
5. **Interface Responsiva** - Frontend atualiza automaticamente
6. **Monitoramento** - Dashboard para acompanhar métricas

Os webhooks garantem que o sistema sempre tenha o status mais atualizado dos saques, proporcionando uma experiência fluida e confiável para os usuários.