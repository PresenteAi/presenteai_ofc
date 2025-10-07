# Gift Events Module

O módulo `gift-events` é responsável por gerenciar a associação de presentes (templates ou templates personalizados) com eventos específicos. É aqui onde acontece a instanciação de um presente dentro de um evento, incluindo o controle de valores coletados e status.

## Funcionalidades

### Principais Recursos

- **Associação de Presentes a Eventos**: Vincula templates de presentes (base ou personalizados) a eventos específicos
- **Gerenciamento de Valores**: Controle de valores efetivos, personalizados e coletados
- **Status de Progresso**: Acompanhamento do status (aberto/completado) e progresso de arrecadação
- **Contribuições**: Adição e controle de contribuições para cada presente
- **Estatísticas**: Relatórios agregados por evento

### Regras de Negócio

1. **Exclusividade de Template**: Um presente no evento deve ter apenas um dos dois:
   - `giftTemplateId` (template base)
   - `giftTemplateChangedId` (template personalizado)

2. **Prioridade de Valores**: O valor efetivo é determinado pela seguinte prioridade:
   - `customValue` (valor personalizado no evento)
   - `giftTemplateChanged.value` (valor do template personalizado)
   - `giftTemplate.defaultValue` (valor padrão do template base)

3. **Prioridade de Campos**: Para campos como título, descrição, imagem e categoria:
   - Se existe `giftTemplateChanged`, usa seus campos (ou do template base associado se nulo)
   - Caso contrário, usa campos do `giftTemplate`

4. **Auto-completamento**: Um presente é automaticamente marcado como completado quando `collectedValue >= effectiveValue`

5. **Unicidade**: Não é possível ter o mesmo template (base ou personalizado) associado ao mesmo evento duas vezes

## Estrutura do Banco de Dados

```sql
CREATE TABLE gift_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    gift_template_id INT NULL,
    gift_template_changed_id INT NULL,
    custom_value DECIMAL(10,2) NULL,
    collected_value DECIMAL(10,2) DEFAULT 0,
    status ENUM('open', 'completed') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (gift_template_id) REFERENCES gift_templates(id),
    FOREIGN KEY (gift_template_changed_id) REFERENCES gift_templates_changed(id),
    
    CONSTRAINT check_template_exclusivity 
        CHECK ((gift_template_id IS NOT NULL AND gift_template_changed_id IS NULL) 
               OR (gift_template_id IS NULL AND gift_template_changed_id IS NOT NULL))
);
```

## API Endpoints

### Principais Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/gift-events` | Criar novo presente no evento |
| `GET` | `/gift-events` | Listar presentes com filtros e paginação |
| `GET` | `/gift-events/event/:eventId` | Listar presentes de um evento específico |
| `GET` | `/gift-events/event/:eventId/stats` | Estatísticas dos presentes do evento |
| `GET` | `/gift-events/:id` | Buscar presente específico |
| `PATCH` | `/gift-events/:id` | Atualizar presente |
| `PATCH` | `/gift-events/:id/contribution` | Adicionar contribuição |
| `PATCH` | `/gift-events/:id/collected-value` | Definir valor coletado |
| `PATCH` | `/gift-events/:id/complete` | Marcar como completado |
| `PATCH` | `/gift-events/:id/reopen` | Reabrir para contribuições |
| `DELETE` | `/gift-events/:id` | Remover presente do evento |

### Filtros Disponíveis

- `eventId`: Filtrar por evento específico
- `giftTemplateId`: Filtrar por template base
- `giftTemplateChangedId`: Filtrar por template personalizado
- `status`: Filtrar por status (open/completed)
- `minValue`/`maxValue`: Filtrar por faixa de valor efetivo
- `page`/`limit`: Paginação
- `sortBy`/`sortOrder`: Ordenação

## Exemplos de Uso

### Criar Presente no Evento

```typescript
// Usando template base
const giftEvent = await giftEventsService.create({
  eventId: 1,
  giftTemplateId: 5,
  customValue: 150.00, // Opcional: sobrescreve valor do template
  status: GiftEventStatus.OPEN
});

// Usando template personalizado
const customGiftEvent = await giftEventsService.create({
  eventId: 1,
  giftTemplateChangedId: 3,
  // customValue não necessário se o template changed já tem valor definido
});
```

### Adicionar Contribuição

```typescript
// Adiciona R$ 25,00 ao valor já coletado
const updatedGift = await giftEventsService.addContribution(giftEventId, 25.00);

// Ou definir valor total coletado diretamente
const updatedGift = await giftEventsService.updateCollectedValue(giftEventId, 100.00);
```

### Obter Estatísticas do Evento

```typescript
const stats = await giftEventsService.getEventStats(eventId);
// Retorna:
// {
//   totalGifts: 5,
//   completedGifts: 2,
//   openGifts: 3,
//   totalValue: 1500.00,
//   collectedValue: 800.00,
//   averageProgress: 53
// }
```

## DTOs

### CreateGiftEventDto

```typescript
{
  eventId: number;                    // Obrigatório
  giftTemplateId?: number;           // Obrigatório se giftTemplateChangedId não fornecido
  giftTemplateChangedId?: number;    // Obrigatório se giftTemplateId não fornecido
  customValue?: number;              // Opcional: valor personalizado
  status?: GiftEventStatus;          // Opcional: padrão 'open'
}
```

### GiftEventResponseDto

```typescript
{
  id: number;
  eventId: number;
  eventTitle: string;
  giftTemplateId?: number;
  giftTemplateChangedId?: number;
  title: string;                     // Título efetivo
  description?: string;              // Descrição efetiva
  imageUrl?: string;                 // Imagem efetiva
  category?: string;                 // Categoria efetiva
  effectiveValue: number;            // Valor efetivo calculado
  customValue?: number;              // Valor personalizado definido
  collectedValue: number;            // Valor arrecadado
  remainingValue: number;            // Valor restante
  progressPercentage: number;        // Progresso (0-100%)
  status: string;                    // 'open' | 'completed'
  canReceiveContributions: boolean;  // Se pode receber contribuições
  isCompleted: boolean;             // Se está completado
  createdAt: Date;
  updatedAt: Date;
}
```

## Validações

### Validações de Criação

- Pelo menos um template (base ou personalizado) deve ser fornecido
- Não é possível fornecer ambos os templates simultaneamente
- O evento e o template referenciado devem existir
- Não pode haver duplicação: mesmo template no mesmo evento

### Validações de Atualização

- Valores numéricos devem ser não-negativos
- Status deve ser válido ('open' | 'completed')
- Mudanças de template respeitam regras de unicidade
- Contribuições só podem ser adicionadas a presentes abertos

### Validações de Negócio

- Auto-completamento quando valor coletado >= valor efetivo
- Presentes completados não podem receber contribuições (a menos que reabertos)
- Valores monetários têm precisão de 2 casas decimais

## Testes

O módulo possui cobertura completa de testes unitários:

- **Repository**: Testes de todas as operações de banco de dados
- **Service**: Testes de lógica de negócio e validações
- **Controller**: Testes de endpoints e integração

### Executar Testes

```bash
# Testes específicos do módulo
npm test gift-events

# Testes com cobertura
npm run test:cov -- --testPathPattern=gift-events
```

## Integrações

### Dependências

- **Events Module**: Para validar eventos existentes
- **Gift Templates Module**: Para templates base
- **Gift Templates Changed Module**: Para templates personalizados

### Usado Por

- **Contributions Module**: Para registrar contribuições em presentes
- **Reports Module**: Para gerar relatórios de eventos
- **Notifications Module**: Para notificações de progresso

## Considerações de Performance

1. **Eager Loading**: Relacionamentos são carregados automaticamente para evitar N+1 queries
2. **Indexação**: Campos `event_id`, `gift_template_id` e `gift_template_changed_id` são indexados
3. **Paginação**: Resultados são sempre paginados para evitar sobrecarga
4. **Query Optimization**: Uso de query builder para filtros complexos

## Melhorias Futuras

- [ ] Cache de estatísticas de eventos para melhor performance
- [ ] Webhooks para notificações de progresso em tempo real
- [ ] Histórico de alterações em valores e status
- [ ] Metas de arrecadação personalizadas por presente
- [ ] Integração com sistemas de pagamento