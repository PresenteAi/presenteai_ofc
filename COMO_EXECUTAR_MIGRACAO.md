# Como Executar a Migração

## Opção 1: Script Automático (Recomendado)

### No Linux/WSL:
```bash
cd /home/vivicomferreira/presenteai_ofc
chmod +x migrate.sh
./migrate.sh
```

### No Windows PowerShell:
```powershell
cd C:\Users\USER\AppData\Local\Packages\CanonicalGroupLimited.Ubuntu24.04LTS_79rhkp1fndgsc\LocalState\rootfs\home\vivicomferreira\presenteai_ofc
.\migrate.ps1
```

## Opção 2: Manual via MySQL

### 1. Conectar ao MySQL:
```bash
mysql -h172.17.80.1 -P3306 -uroot -pfamilia100 presenteai
```

### 2. Executar o script:
```sql
source migration.sql;
```

### 3. Verificar as tabelas:
```sql
SHOW TABLES;
DESCRIBE user;
DESCRIBE event;
```

## Opção 3: Usando MySQL Workbench
1. Abra o MySQL Workbench
2. Conecte com: Host: `172.17.80.1`, Port: `3306`, User: `root`, Password: `familia100`
3. Selecione o database `presenteai`
4. Abra o arquivo `migration.sql`
5. Execute o script (Ctrl+Shift+Enter)

## Após a Migração

### 1. Reiniciar a aplicação:
```bash
cd /home/vivicomferreira/presenteai_ofc
npm run start:dev
```

### 2. Testar os endpoints:
```bash
# Criar um usuário
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "123456"}'

# Criar um evento (após login)
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title": "Test Event", "eventType": "birthday", "startDate": "2025-12-25"}'

# Buscar evento por ID (agora é um número!)
curl http://localhost:3000/events/1
```

### 3. Verificar se tudo funciona:
- [ ] Registro de usuário
- [ ] Login
- [ ] Criação de evento
- [ ] Listagem de eventos
- [ ] Busca por ID numérico
- [ ] Atualização e exclusão

## Troubleshooting

### Erro de conexão MySQL:
```bash
# Verificar se MySQL está rodando
sudo service mysql status

# Iniciar MySQL se necessário
sudo service mysql start
```

### Banco não existe:
```sql
CREATE DATABASE presenteai;
```

### Problemas de permissão:
```sql
GRANT ALL PRIVILEGES ON presenteai.* TO 'root'@'%';
FLUSH PRIVILEGES;
```

## Rollback (se necessário)

⚠️ **ATENÇÃO**: Não há rollback automático! Se precisar voltar:

1. Faça backup antes da migração
2. Ou recrie o banco com as tabelas antigas
3. Ou reverta todo o código para UUIDs

## Benefícios da Migração

✅ **Performance**: Consultas mais rápidas  
✅ **URLs Amigáveis**: `/events/1` ao invés de `/events/uuid-longo`  
✅ **Menor Uso de Memória**: 4-8 bytes vs 36 bytes por ID  
✅ **Simplicidade**: Mais fácil para debug e desenvolvimento  
✅ **Indexação**: IDs inteiros são mais eficientes para índices