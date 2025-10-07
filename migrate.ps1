# Script PowerShell para executar a migração
# De UUID para Integer Auto-increment

Write-Host "🚀 Iniciando migração UUID → Integer Auto-increment" -ForegroundColor Green
Write-Host "⚠️  ATENÇÃO: Este script irá APAGAR todos os dados existentes!" -ForegroundColor Yellow
Write-Host ""

# Configurações do banco
$MYSQL_HOST = "172.17.80.1"
$MYSQL_PORT = "3306"
$MYSQL_USER = "root"
$MYSQL_PASSWORD = "familia100"
$MYSQL_DATABASE = "presenteai"

# Confirmar a operação
$confirm = Read-Host "Tem certeza que deseja continuar? (digite 'sim' para confirmar)"
if ($confirm -ne "sim") {
    Write-Host "❌ Operação cancelada." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📊 Executando migração..." -ForegroundColor Blue

try {
    # Executar o script SQL
    mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" -e "source migration.sql"
    
    Write-Host "✅ Migração executada com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. Reinicie a aplicação: npm run start:dev"
    Write-Host "2. Teste os endpoints com IDs inteiros (ex: GET /events/1)"
    Write-Host "3. Crie novos usuários e eventos para testar"
    Write-Host ""
    Write-Host "📋 Mudanças aplicadas:" -ForegroundColor Yellow
    Write-Host "- IDs são agora inteiros auto-increment"
    Write-Host "- URLs amigáveis: /events/1 ao invés de /events/uuid"
    Write-Host "- Melhor performance nas consultas"
}
catch {
    Write-Host "❌ Erro ao executar a migração!" -ForegroundColor Red
    Write-Host "Verifique:" -ForegroundColor Yellow
    Write-Host "- Se o MySQL está rodando"
    Write-Host "- Se as credenciais estão corretas"
    Write-Host "- Se o banco 'presenteai' existe"
    exit 1
}