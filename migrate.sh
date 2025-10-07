#!/bin/bash

# Script para executar a migração do banco de dados
# De UUID para Integer Auto-increment

echo "🚀 Iniciando migração UUID → Integer Auto-increment"
echo "⚠️  ATENÇÃO: Este script irá APAGAR todos os dados existentes!"
echo ""

# Verificar se o MySQL está rodando
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL não encontrado. Instale o MySQL client primeiro."
    exit 1
fi

# Configurações do banco (ajuste conforme necessário)
MYSQL_HOST="172.17.80.1"
MYSQL_PORT="3306"
MYSQL_USER="root"
MYSQL_PASSWORD="familia100"
MYSQL_DATABASE="presenteai"

# Confirmar a operação
read -p "Tem certeza que deseja continuar? (digite 'sim' para confirmar): " confirm
if [ "$confirm" != "sim" ]; then
    echo "❌ Operação cancelada."
    exit 1
fi

echo ""
echo "📊 Executando migração..."

# Executar o script SQL
mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" < migration.sql

if [ $? -eq 0 ]; then
    echo "✅ Migração executada com sucesso!"
    echo ""
    echo "🎉 Próximos passos:"
    echo "1. Reinicie a aplicação: npm run start:dev"
    echo "2. Teste os endpoints com IDs inteiros (ex: GET /events/1)"
    echo "3. Crie novos usuários e eventos para testar"
    echo ""
    echo "📋 Mudanças aplicadas:"
    echo "- IDs são agora inteiros auto-increment"
    echo "- URLs amigáveis: /events/1 ao invés de /events/uuid"
    echo "- Melhor performance nas consultas"
else
    echo "❌ Erro ao executar a migração!"
    echo "Verifique:"
    echo "- Se o MySQL está rodando"
    echo "- Se as credenciais estão corretas"
    echo "- Se o banco 'presenteai' existe"
    exit 1
fi