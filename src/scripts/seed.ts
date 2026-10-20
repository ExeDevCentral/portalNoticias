import { db } from '../db';
import { NewsRepository } from '../db/news-repository';
import { seedDatabase } from './seed-data';

async function main() {
  console.log('Iniciando sincronización de noticias reales en Rosario en Tiempo Real...');
  const repo = new NewsRepository(db);
  
  // Limpiar notas falsas anteriores
  await repo.clearAllNews();
  console.log('🧹 Base de datos purgada: notas falsas anteriores eliminadas.');

  // Cargar noticias reales en vivo de los diarios del mundo, nacionales y locales
  await seedDatabase(repo, { liveSync: true });
  
  const news = await repo.getLatestNews(100);
  console.log(`✅ Base de datos cargada con éxito: ${news.length} noticias reales activas.`);
}

main().catch((err) => {
  console.error('Error durante el seed:', err);
  process.exit(1);
});
