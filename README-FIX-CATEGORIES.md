# Correção das Tabelas de Categorias e Eventos no PostgreSQL

## Problema

Ao tentar editar as categorias de um evento, você pode se deparar com o seguinte erro:

```
Error: Erro ao atualizar evento: 
Invalid `prisma.event.update()` invocation:

Error occurred during query execution:
ConnectorError(ConnectorError { user_facing_error: None, kind: QueryError(PostgresError { code: "55000", message: "cannot delete from table "_EventCategories" because it does not have a replica identity and publishes deletes", severity: "ERROR", detail: None, column: None, hint: Some("To enable deleting from the table, set REPLICA IDENTITY using ALTER TABLE.") }), transient: false })
```

Este erro ocorre porque as tabelas envolvidas no relacionamento eventos-categorias não estão configuradas com uma REPLICA IDENTITY adequada, o que impede operações de exclusão necessárias para atualizar as categorias de um evento.

## Solução

Para resolver este problema, você precisa configurar a REPLICA IDENTITY como FULL em múltiplas tabelas. Foi criado um script para facilitar este processo.

### Passo 1: Executar o Script

```bash
node fix-event-categories.js
```

Este script identifica e configura a REPLICA IDENTITY como FULL nas tabelas relevantes:
- `_EventCategories` (tabela de junção criada pelo Prisma)
- `Category` (tabela principal de categorias)
- `Event` (tabela principal de eventos)

### Passo 2: Verificar a Execução

Se o script for executado com sucesso, você verá mensagens de confirmação para cada tabela:

```
✅ REPLICA IDENTITY configurada com sucesso na tabela "_EventCategories"
✅ REPLICA IDENTITY configurada com sucesso na tabela "Category"
✅ REPLICA IDENTITY configurada com sucesso na tabela "Event"
```

### Problema de Permissões?

Se você receber um erro de permissão, pode ser necessário executar os comandos SQL diretamente no PostgreSQL como um usuário com privilégios de administrador:

```sql
ALTER TABLE "_EventCategories" REPLICA IDENTITY FULL;
ALTER TABLE "Category" REPLICA IDENTITY FULL;
ALTER TABLE "Event" REPLICA IDENTITY FULL;
```

## Executando Diretamente no PostgreSQL

Se preferir, você pode executar os comandos diretamente no PostgreSQL:

1. Conecte-se ao banco de dados:
   ```bash
   psql -U seu_usuario -d technest
   ```

2. Execute os comandos:
   ```sql
   ALTER TABLE "_EventCategories" REPLICA IDENTITY FULL;
   ALTER TABLE "Category" REPLICA IDENTITY FULL;
   ALTER TABLE "Event" REPLICA IDENTITY FULL;
   ```

3. Verifique se a configuração foi aplicada:
   ```sql
   SELECT relname, relreplident FROM pg_class 
   WHERE relname IN ('_EventCategories', 'Category', 'Event');
   ```
   Se retornar `f` para cada tabela, a REPLICA IDENTITY foi configurada como FULL.

## Explicação Técnica

A REPLICA IDENTITY determina quais informações são armazenadas no WAL (Write-Ahead Log) para operações de UPDATE e DELETE. Quando definida como FULL, o PostgreSQL armazena a imagem completa da linha que está sendo modificada ou excluída, o que é necessário para replicação lógica e para operações que afetam múltiplas linhas de uma vez.

Sem a configuração adequada da REPLICA IDENTITY, o PostgreSQL não permite operações de exclusão em tabelas que estão configuradas para publicar eventos de exclusão (o que é o caso quando a replicação lógica está habilitada).

## Após a Correção

Depois de aplicar esta correção, você poderá editar as categorias dos eventos normalmente, sem encontrar o erro de REPLICA IDENTITY. O código de atualização de eventos agora usará a abordagem padrão do Prisma, que é mais simples e robusta.