# 🚀 Status da Migração UUID para Integer

## ✅ Concluído

### Entidades
- ✅ `User.id: string` → `User.id: number`
- ✅ `Event.id: string` → `Event.id: number`  
- ✅ `Event.userId: string` → `Event.userId: number`

### DTOs
- ✅ `CreateEventDto.userId: number`
- ✅ `EventPaginationDto.userId: number`
- ✅ `UserOutputDto.id: number`
- ✅ `EventOutputDto.id & userId: number`
- ✅ `JwtPayload.sub: number`
- ✅ `LoginResponseDto.id: number`

### Decorators
- ✅ `@UserId()` retorna `number`

### Controllers (Parcial)
- ✅ `ParseUUIDPipe` → `ParseIntPipe`
- ✅ Parâmetros `id: number`

## ⚠️ Em Progresso - Requer Finalização

### Services
```typescript
// UsersService - ATUALIZAR:
- findById(id: number) ✅
- update(id: number) ✅ 
- remove(id: number) ✅
- updateLastLogin(id: number) ✅

// EventsService - ATUALIZAR:
- findById(id: string) → findById(id: number)
- update(id: string) → update(id: number)
- remove(id: string) → remove(id: number)
- togglePublish(id: string) → togglePublish(id: number)
- Remover .trim() de userId (números não têm .trim())
```

### Repositories  
```typescript
// UsersRepository - ATUALIZAR:
- findById(id: number) ✅
- update(id: number) ✅
- softDelete(id: string) → softDelete(id: number)
- updateLastLogin(id: string) → updateLastLogin(id: number)
- Comparações id !== id (number vs string)

// EventsRepository - ATUALIZAR:
- findById(id: string) → findById(id: number)
- update(id: string) → update(id: number)
- softDelete(id: string) → softDelete(id: number)
- Queries where: { id } (string → number)
- Queries where: { userId } (string → number)
```

## 🔧 Comandos para Finalizar Rapidamente

### 1. Buscar e Substituir em Massa
```bash
# Trocar todas as validações de string para number
find . -name "*.ts" -exec sed -i 's/typeof.*!== '\''string'\''/typeof id !== '\''number'\''/g' {} \;
find . -name "*.ts" -exec sed -i 's/id\.trim()/id/g' {} \;
find . -name "*.ts" -exec sed -i 's/userId\.trim()/userId/g' {} \;

# Trocar assinaturas de métodos
find . -name "*.ts" -exec sed -i 's/findById(id: string)/findById(id: number)/g' {} \;
find . -name "*.ts" -exec sed -i 's/update(id: string/update(id: number/g' {} \;
find . -name "*.ts" -exec sed -i 's/remove(id: string/remove(id: number/g' {} \;
find . -name "*.ts" -exec sed -i 's/softDelete(id: string/softDelete(id: number/g' {} \;
```

### 2. Migração de Banco de Dados
```sql
-- Criar tabelas com auto-increment
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(300) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  is_indicated BOOLEAN DEFAULT 0,
  indicated_by_id INTEGER,
  last_login_at DATETIME,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  event_type VARCHAR(50) NOT NULL,
  cover_image_url VARCHAR(500),
  primary_color VARCHAR(7),
  secondary_color VARCHAR(7),
  tertiary_color VARCHAR(7),
  font_family VARCHAR(100),
  start_date DATE,
  end_date DATE,
  public_url VARCHAR(100) UNIQUE NOT NULL,
  is_published BOOLEAN DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 📋 Próximos Passos

1. **Executar script de busca/substituição**
2. **Corrigir erros restantes manualmente**
3. **Executar migração do banco**
4. **Testar todos os endpoints**
5. **Atualizar testes**

## 🎯 Resultado Esperado

- ✅ IDs inteiros auto-incremento
- ✅ Performance melhorada
- ✅ Compatibilidade com sistemas legados
- ✅ Menos uso de memória
- ✅ Queries mais rápidas

**Status: 75% concluído - Requer finalização sistemática**