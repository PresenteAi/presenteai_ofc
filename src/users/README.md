# CRUD de Usuários - Implementação com Segurança e Integridade

## 📋 Visão Geral

Este módulo implementa um sistema completo de CRUD para usuários com foco em **segurança** e **integridade de dados**. Utiliza NestJS, TypeORM e bcrypt para proporcionar uma solução robusta e escalável.

## 🔒 Aspectos de Segurança Implementados

### 1. **Criptografia de Senhas**
- **Bcrypt com Salt Rounds 12**: Todas as senhas são hasheadas usando bcrypt com 12 rounds de salt
- **Validação de Força**: Senhas devem conter no mínimo 8 caracteres, uma maiúscula, uma minúscula, um número e um caractere especial
- **Regex Pattern**: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/`

### 2. **Validação de Entrada (Input Validation)**
- **Sanitização de Dados**: Emails são convertidos para lowercase e dados são trimados
- **Validação de Email**: Regex para validar formato de email válido
- **Limitação de Tamanho**: 
  - Nome: 2-300 caracteres
  - Email: máximo 150 caracteres
  - Senha: 8-255 caracteres
- **ValidationPipe**: Uso do pipe do NestJS com `whitelist: true` e `forbidNonWhitelisted: true`

### 3. **Prevenção de Duplicatas**
- **Unique Constraint**: Email único no banco de dados
- **Verificação Prévia**: Verificação antes de criar/atualizar se email já existe
- **ConflictException**: Retorna erro 409 quando email já está em uso

### 4. **Soft Delete**
- **Não Deleção Física**: Usuários são desativados (isActive = false) ao invés de deletados
- **Preservação de Dados**: Mantém histórico e integridade referencial
- **Consultas Filtradas**: Queries filtram apenas usuários ativos por padrão

### 5. **Sanitização de Consultas**
- **Select Específico**: Não expõe o campo `passwordHash` nas consultas de listagem
- **Parâmetros Sanitizados**: Validação e sanitização de parâmetros de paginação
- **Prevenção de SQL Injection**: Uso de prepared statements via TypeORM

### 6. **Rate Limiting via Paginação**
- **Limite Máximo**: Máximo 100 itens por página
- **Paginação Obrigatória**: Todas as listagens são paginadas
- **Performance**: Evita sobrecarga do servidor com consultas muito grandes

### 7. **Validação de UUID**
- **ParseUUIDPipe**: Validação automática de formato UUID nos parâmetros
- **Tipo Seguro**: Uso de UUID v4 para IDs únicos e seguros

### 8. **Logging de Segurança**
- **Último Login**: Registro do timestamp do último login
- **Auditoria**: Campos createdAt e updatedAt para rastreamento

### 9. **Tratamento de Erros Seguro**
- **Não Exposição de Detalhes**: Mensagens de erro genéricas para evitar vazamento de informações
- **Status Codes Apropriados**: 
  - 400: Bad Request (dados inválidos)
  - 404: Not Found (recurso não encontrado)
  - 409: Conflict (email já existe)
  - 422: Unprocessable Entity (validação falhou)

### 10. **Estrutura de Resposta Consistente**
- **DTOs de Saída**: Controle total sobre dados expostos
- **Exclusão de Campos Sensíveis**: PasswordHash nunca é retornado nas APIs
- **Padronização**: Estrutura consistente em todas as respostas

## 🏗️ Arquitetura

```
src/users/
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts          # DTO para criação
│   │   ├── update-user.dto.ts          # DTO para atualização
│   │   ├── default.output.dto.ts       # DTO de saída
│   │   ├── pagination.dto.ts           # DTO de paginação
│   │   └── paginated-users.dto.ts      # DTO de resposta paginada
│   ├── entities/
│   │   └── user.entity.ts              # Entidade TypeORM
│   ├── users.controller.ts             # Controlador REST
│   ├── users.service.ts                # Lógica de negócio
│   ├── users.repository.ts             # Acesso a dados
│   └── users.repository.spec.ts        # Testes unitários
└── users.module.ts                     # Módulo NestJS
```

## 📊 Endpoints Disponíveis

### POST /users
Cria um novo usuário
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "MinhaSenh@123",
  "indicatedById": 1
}
```

### GET /users
Lista usuários com paginação
```
Query Params:
- page: número da página (padrão: 1)
- limit: itens por página (padrão: 10, máx: 100)
- sortBy: campo de ordenação (name, email, createdAt, updatedAt)
- sortOrder: direção (ASC, DESC)
- search: termo de busca para nome ou email
```

### GET /users/:id
Busca usuário por ID (UUID)

### PUT /users/:id
Atualiza usuário (campos opcionais)

### DELETE /users/:id
Remove usuário (soft delete)

### GET /users/email/:email
Busca usuário por email

### GET /users/stats/count
Conta usuários ativos

## 🧪 Testes

```bash
# Executar testes unitários
npm run test

# Executar testes com coverage
npm run test:cov

# Executar testes específicos do módulo users
npm run test -- users
```

## 🔧 Configuração

### Dependências Necessárias
```json
{
  "bcrypt": "^6.0.0",
  "@nestjs/typeorm": "^11.0.0",
  "typeorm": "^0.3.27",
  "@nestjs/swagger": "^11.2.0"
}
```

### Tipos de Desenvolvimento
```json
{
  "@types/bcrypt": "^5.0.0"
}
```

## 📈 Melhorias Futuras

### Segurança Adicional
- [ ] Implementar JWT Authentication
- [ ] Rate Limiting por IP
- [ ] Logs de auditoria detalhados
- [ ] Validação de força de senha personalizada
- [ ] 2FA (Two-Factor Authentication)

### Performance
- [ ] Cache Redis para consultas frequentes
- [ ] Índices otimizados no banco
- [ ] Compressão de resposta
- [ ] Lazy loading para relacionamentos

### Observabilidade
- [ ] Métricas com Prometheus
- [ ] Tracing distribuído
- [ ] Health checks avançados
- [ ] Alertas automáticos

## ⚠️ Considerações de Produção

1. **Variables de Ambiente**: Configure `BCRYPT_SALT_ROUNDS` via environment
2. **Database Connection**: Use connection pooling adequado
3. **HTTPS**: Sempre use HTTPS em produção
4. **Headers de Segurança**: Configure helmet.js
5. **CORS**: Configure CORS adequadamente
6. **Rate Limiting**: Implemente rate limiting global

## 📝 Documentação da API

A documentação completa da API está disponível via Swagger em `/api/docs` quando o servidor estiver rodando.

---

**Desenvolvido com foco em segurança, performance e manutenibilidade** 🚀