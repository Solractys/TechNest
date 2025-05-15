/**
 * Script para corrigir problemas com categorias em eventos
 * 
 * Este script configura a REPLICA IDENTITY como FULL nas tabelas relevantes
 * para permitir operações de exclusão e atualização nas relações entre eventos e categorias.
 * 
 * Execução:
 * node fix-event-categories.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixEventCategoriesTables() {
  try {
    // Verificando quais tabelas precisam ser corrigidas
    console.log("🔍 Verificando tabelas relacionadas a eventos e categorias...");
    
    // Lista de tabelas para verificar e configurar
    const tablesToFix = [
      "_EventCategories",  // Tabela de junção (relacionamento many-to-many)
      "Category",          // Tabela principal de categorias
      "Event"              // Tabela principal de eventos
    ];
    
    for (const tableName of tablesToFix) {
      try {
        console.log(`🔄 Configurando REPLICA IDENTITY para a tabela "${tableName}"...`);
        
        // Verificando se a tabela existe antes de tentar alterar
        const tableExists = await prisma.$queryRaw`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = ${tableName}
          )
        `;
        
        if (!tableExists[0].exists) {
          console.log(`⚠️ Tabela "${tableName}" não encontrada, pulando...`);
          continue;
        }
        
        // Configurando REPLICA IDENTITY FULL na tabela
        await prisma.$executeRawUnsafe(`ALTER TABLE "${tableName}" REPLICA IDENTITY FULL;`);
        console.log(`✅ REPLICA IDENTITY configurada com sucesso na tabela "${tableName}"`);
      } catch (tableError) {
        console.error(`❌ Erro ao configurar REPLICA IDENTITY para "${tableName}":`, tableError.message);
      }
    }

    console.log("\n✨ Processo de correção concluído!");
    console.log("📝 Se alguma tabela apresentou erros, você pode tentar configurá-la manualmente.");
    
  } catch (error) {
    console.error("❌ Erro geral durante o processo:", error);
    console.log("\n📋 Instruções para correção manual:");
    console.log("1. Conecte-se ao PostgreSQL diretamente:");
    console.log("   psql -U seu_usuario -d technest");
    console.log("2. Execute o comando para cada tabela:");
    console.log('   ALTER TABLE "_EventCategories" REPLICA IDENTITY FULL;');
    console.log('   ALTER TABLE "Category" REPLICA IDENTITY FULL;');
    console.log('   ALTER TABLE "Event" REPLICA IDENTITY FULL;');
  } finally {
    await prisma.$disconnect();
  }
}

// Executar a função
fixEventCategoriesTables()
  .then(() => {
    console.log("\n🎉 Depois de aplicar esta correção, você deverá conseguir editar as categorias dos eventos normalmente!");
  })
  .catch(finalError => {
    console.error("\n❌ Erro final:", finalError.message);
    process.exit(1);
  });