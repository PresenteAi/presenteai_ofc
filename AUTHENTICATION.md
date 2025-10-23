# Sistema de Autenticação JWT - PresenteAI

## 🔐 Implementação Completa de Autenticação

Este documento descreve o sistema de autenticação JWT implementado no PresenteAI, garantindo que usuários só possam acessar seus próprios dados.

## 📁 Estrutura de Arquivos Criados

```
src/auth/
├── auth/
│   ├── auth.controller.ts    # Endpoints de autenticação
│   ├── auth.service.ts       # Lógica de login e validação
│   └── dto/
│       └── login.dto.ts      # DTOs de login e resposta
├── decorators/
│   ├── current-user.decorator.ts  # Decorator para obter usuário atual
│   └── public.decorator.ts       # Decorator para rotas públicas
├── guards/
│   └── jwt-auth.guard.ts     # Guard JWT global
└── strategies/
    └── jwt.strategy.ts       # Estratégia de autenticação JWT
```

## 🚀 Endpoints de Autenticação

### POST /auth/login
Realiza login e retorna token JWT.

**Request:**
```json
{
  "email": "joao@email.com",
  "password": "Senha123!"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "bearer",
  "expiresIn": 3600,
  "user": {
    "id": "uuid-string",
    "name": "João Silva",
    "email": "joao@email.com"
  }
}
```

## 🔒 Rotas Protegidas

### Sistema de Segurança por Usuário

Todas as rotas de eventos agora aplicam filtros automáticos por usuário:

1. **GET /events** - Lista apenas eventos do usuário autenticado
2. **GET /events/:id** - Retorna evento apenas se pertencer ao usuário
3. **POST /events** - Cria evento para o usuário autenticado
4. **PATCH /events/:id** - Atualiza apenas se o evento pertencer ao usuário
5. **DELETE /events/:id** - Remove apenas se o evento pertencer ao usuário
6. **PATCH /events/:id/publish** - Publica apenas se o evento pertencer ao usuário

### Rotas Públicas

Algumas rotas permanecem públicas (não requerem autenticação):

- **GET /** - Endpoint de status da API
- **POST /users** - Criação de novos usuários
- **POST /auth/login** - Endpoint de login
- **GET /events/public/:publicUrl** - Acesso público aos eventos
- **GET /events/stats/count** - Estatísticas gerais
- **GET /events/stats/upcoming** - Eventos próximos

## 🛡️ Validações de Segurança Implementadas

### 1. Autenticação Automática
```typescript
// Guard global aplicado automaticamente
{
  provide: APP_GUARD,
  useClass: JwtAuthGuard,
}
```

### 2. Verificação de Propriedade
```typescript
// Exemplo no EventsController
async update(id: string, updateDto: UpdateEventDto, @UserId() userId: string) {
  const event = await this.service.findById(id);
  if (event.userId !== userId) {
    throw new ForbiddenException('You can only update your own events');
  }
  return this.service.update(id, updateDto);
}
```

### 3. Filtros Automáticos
```typescript
// GET /events agora filtra automaticamente por usuário
async findAll(paginationDto: EventPaginationDto, @UserId() userId: string) {
  paginationDto.userId = userId; // Força filtro por usuário
  return this.service.findAll(paginationDto);
}
```

## 🔧 Configuração de Ambiente

### Variáveis de Ambiente Necessárias

```env
JWT_SECRET=your-very-secure-secret-key-here
```

## 📱 Como Usar a Autenticação

### 1. Frontend - Login
```typescript
const loginResponse = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'usuario@email.com',
    password: 'senha123'
  })
});

const { accessToken } = await loginResponse.json();
localStorage.setItem('token', accessToken);
```

### 2. Frontend - Requisições Autenticadas
```typescript
const response = await fetch('/events', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});
```

### 3. Mobile - Headers de Autenticação
```typescript
const headers = {
  'Authorization': `Bearer ${userToken}`,
  'Content-Type': 'application/json'
};

const events = await fetch('/events', { headers });
```

## 🚨 Tratamento de Erros

### Status Codes de Autenticação

- **401 Unauthorized** - Token inválido ou não fornecido
- **403 Forbidden** - Token válido mas sem permissão para o recurso
- **400 Bad Request** - Dados de login inválidos

### Exemplos de Respostas de Erro

```json
// 401 - Token inválido
{
  "statusCode": 401,
  "message": "Unauthorized"
}

// 403 - Tentativa de acessar evento de outro usuário
{
  "statusCode": 403,
  "message": "You can only access your own events"
}
```

## ⚡ Benefícios da Implementação

### 1. Segurança Automática
- ✅ Usuários só veem seus próprios dados
- ✅ Impossível acessar dados de outros usuários
- ✅ Validação automática em todas as rotas

### 2. Experiência Simplificada
- ✅ Não precisa passar userId nas requisições
- ✅ Filtros automáticos aplicados
- ✅ Interface mais limpa

### 3. Escalabilidade
- ✅ Sistema preparado para multi-tenancy
- ✅ Isolamento completo entre usuários
- ✅ Base sólida para futuras funcionalidades

## 🔄 Próximos Passos

1. **Implementar Refresh Tokens** - Para renovação automática
2. **Rate Limiting** - Proteção contra ataques de força bruta
3. **Logs de Auditoria** - Rastreamento de ações dos usuários
4. **2FA** - Autenticação de dois fatores
5. **OAuth** - Login social (Google, Facebook)

## 📋 Checklist de Implementação

- ✅ JWT Strategy configurada
- ✅ Auth Guard global aplicado
- ✅ Decorators para usuário atual criados
- ✅ Rotas públicas marcadas
- ✅ EventsController protegido
- ✅ Filtros por usuário implementados
- ✅ Validações de propriedade adicionadas
- ✅ Tratamento de erros implementado
- ✅ Documentação Swagger atualizada

## 🚀 Sistema Pronto para Produção!

O sistema de autenticação está completamente implementado e ready for production, garantindo segurança total e isolamento entre usuários.