import { db } from '../db';
import { NewsRepository } from '../db/news-repository';
import { seedDatabase } from './seed-data';

async function main() {
  console.log('Iniciando carga de datos iniciales en Rosario en Tiempo Real...');
  const repo = new NewsRepository(db);
  await seedDatabase(repo);
  console.log('✅ Base de datos inicializada correctamente con noticias regionales de Rosario.');
}

main().catch((err) => {
  console.error('Error durante el seed:', err);
  process.exit(1);
});
