# Withdrawals Module

Este módulo é responsável por gerenciar saques e retiradas de fundos dos usuários na plataforma Presente Aí.

## 📋 Visão Geral

O sistema de withdrawals permite que organizadores de eventos solicitem o saque dos valores arrecadados através das contribuições dos presentes. O módulo oferece controle completo sobre o ciclo de vida dos saques, desde a solicitação até o processamento final.

## 🏗️ Estrutura do Módulo

```
src/withdrawals/
├── entities/
│   └── withdrawal.entity.ts         # Entidade principal do saque
├── dto/
│   ├── create-withdrawal.dto.ts     # DTO para criação de saque
│   ├── update-withdrawal-status.dto.ts  # DTO para atualização de status
│   └── withdrawal-filters.dto.ts    # DTO para filtros de consulta
├── repositories/
│   └── withdrawal.repository.ts     # Repository customizado
├── services/
│   ├── withdrawals.service.ts       # Lógica de negócio
│   └── withdrawals.service.spec.ts  # Testes unitários do service
├── controllers/
│   ├── withdrawals.controller.ts    # Endpoints REST
│   └── withdrawals.controller.spec.ts # Testes unitários do controller
└── withdrawals.module.ts           # Módulo NestJS
```

## 🔄 Estados dos Saques

- **PENDING**: Saque solicitado, aguardando processamento
- **PROCESSING**: Saque em processamento no gateway de pagamento  
- **COMPLETED**: Saque concluído com sucesso
- **FAILED**: Saque falhou no processamento
- **CANCELLED**: Saque cancelado pelo usuário ou sistema

## 💰 Gateways Suportados

- **STRIPE**: Processamento via Stripe Connect
- **MERCADOPAGO**: Processamento via Mercado Pago
- **PAGARME**: Processamento via Pagar.me
- **PIX**: Transferência via PIX
- **BANK_TRANSFER**: Transferência bancária tradicional

## 🔧 Funcionalidades

### Para Usuários

- ✅ Solicitar saque de fundos disponíveis
- ✅ Consultar saldo disponível para saque
- ✅ Listar histórico de saques
- ✅ Cancelar saques pendentes
- ✅ Validar dados bancários antes do saque

### Para Administradores

- ✅ Visualizar todos os saques do sistema
- ✅ Atualizar status de saques
- ✅ Consultar estatísticas por usuário
- ✅ Identificar saques em atraso
- ✅ Gerenciar configurações de limites

## 📊 Regras de Negócio

### Limites e Validações

- **Valor Mínimo**: R$ 10,00
- **Valor Máximo**: R$ 5.000,00 por saque
- **Taxa de Processamento**: 3% sobre o valor
- **Tempo de Processamento**: Até 24 horas úteis

### Validações de Saldo

- Verifica saldo disponível antes de criar saque
- Desconta saques pendentes do saldo disponível
- Calcula automaticamente taxas e valor líquido

### Validações Bancárias

- Valida formato de códigos bancários
- Verifica dados obrigatórios da conta
- Valida CPF/CNPJ do titular

## 🛠️ API Endpoints

### Endpoints do Usuário

```typescript
// Criar novo saque
POST /withdrawals
Body: CreateWithdrawalDto

// Listar saques do usuário
GET /withdrawals

// Consultar saldo disponível
GET /withdrawals/balance

// Buscar saque por ID
GET /withdrawals/:id

// Cancelar saque
DELETE /withdrawals/:id

// Validar conta bancária
POST /withdrawals/validate-bank-account
```

### Endpoints Administrativos

```typescript
// Listar todos os saques (admin)
GET /withdrawals/admin/all

// Buscar saque por ID (admin)
GET /withdrawals/admin/:id

// Atualizar status do saque
PATCH /withdrawals/admin/:id/status

// Estatísticas do usuário
GET /withdrawals/admin/users/:userId/stats

// Saques em atraso
GET /withdrawals/admin/overdue
```

## 🧪 Testes

O módulo inclui testes unitários completos:

```bash
# Executar testes do módulo
npm test withdrawals

# Executar testes com coverage
npm test:cov withdrawals

# Executar testes em modo watch
npm test:watch withdrawals
```

### Cobertura de Testes

- ✅ WithdrawalsService - 100% cobertura
- ✅ WithdrawalsController - 100% cobertura
- ✅ WithdrawalRepository - Testado via integração
- ✅ Entidades e DTOs - Validação automática

## 📚 Exemplos de Uso

### Criar Saque

```typescript
const createWithdrawal: CreateWithdrawalDto = {
  totalAmount: 500.00,
  paymentGateway: WithdrawalGateway.STRIPE,
  bankAccount: {
    bankCode: '001',
    bankName: 'Banco do Brasil',
    accountType: 'checking',
    accountNumber: '12345-6',
    agency: '1234',
    accountHolderName: 'João Silva',
    accountHolderDocument: '12345678901',
  }
};

const withdrawal = await withdrawalsService.createWithdrawal(userId, createWithdrawal);
```

### Consultar Saldo

```typescript
const balance = await withdrawalsService.getUserBalance(userId);
console.log(balance.availableBalance); // 1000.00
console.log(balance.pendingWithdrawals); // 100.00
```

### Atualizar Status (Admin)

```typescript
const updateStatus: UpdateWithdrawalStatusDto = {
  status: WithdrawalStatus.COMPLETED,
  transactionReference: 'stripe_payout_123',
  processedAt: '2023-12-25T10:30:00.000Z',
  fees: 15.00,
};

const withdrawal = await withdrawalsService.updateWithdrawalStatus(id, updateStatus);
```

## 🔗 Integrações

### Com Transactions Module

- Consulta transações completadas para calcular saldo
- Valida fundos disponíveis antes de criar saque

### Com Users Module

- Verifica permissões de usuário
- Associa saques ao proprietário correto

### Com Auth Module

- Protege endpoints com JWT
- Valida autorização para operações

## 📋 Configurações

As configurações do módulo podem ser ajustadas na tabela `withdrawal_settings`:

```sql
-- Alterar valor mínimo
UPDATE withdrawal_settings 
SET setting_value = '20.00' 
WHERE setting_key = 'minimum_withdrawal_amount';

-- Alterar taxa percentual
UPDATE withdrawal_settings 
SET setting_value = '2.5' 
WHERE setting_key = 'withdrawal_fee_percentage';
```

## 🚀 Deploy e Migração

1. Execute a migração SQL:
```bash
mysql -u root -p presenteai < withdrawals_migration.sql
```

2. Verifique se o módulo foi importado no `app.module.ts`:
```typescript
import { WithdrawalsModule } from './withdrawals/withdrawals.module';
```

3. Execute os testes para validar a instalação:
```bash
npm test withdrawals
```

## 📈 Monitoramento

### Métricas Importantes

- Volume diário de saques
- Taxa de sucesso vs falha
- Tempo médio de processamento
- Saques em atraso (>24h)

### Views SQL para Relatórios

- `v_user_withdrawal_summary`: Resumo por usuário
- `v_overdue_withdrawals`: Saques em atraso
- `v_daily_withdrawal_stats`: Estatísticas diárias

## 🔒 Segurança

- ✅ Autenticação JWT obrigatória
- ✅ Validação de propriedade do saque
- ✅ Sanitização de dados bancários
- ✅ Logs de auditoria para operações admin
- ✅ Limitação de valores por período

## 🐛 Troubleshooting

### Problemas Comuns

1. **Saldo insuficiente**: Verificar se há transações pendentes
2. **Dados bancários inválidos**: Validar formato e obrigatoriedade
3. **Saque em atraso**: Verificar status no gateway
4. **Erro de permissão**: Confirmar JWT e propriedade do recurso

### Logs Relevantes

```bash
# Verificar logs de criação de saque
grep "createWithdrawal" logs/app.log

# Verificar logs de atualização de status
grep "updateWithdrawalStatus" logs/app.log
```

---

**Desenvolvido para Presente Aí** 🎁  
Sistema completo de gerenciamento de saques com alta disponibilidade e segurança.