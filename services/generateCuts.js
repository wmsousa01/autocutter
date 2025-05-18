import fs from 'fs/promises';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateCuts({ srtPath, videoPath }) {
  if (!videoPath) {
    throw new Error('❌ Caminho do vídeo não fornecido.');
  }

  const outputDir = path.join(__dirname, '..', 'cuts');
  await fs.mkdir(outputDir, { recursive: true });

  console.log('⏳ Obtendo duração total do vídeo...');
  const duration = await getVideoDuration(videoPath);

  const segmentLength = 600; // 10 minutos
  const totalCuts = Math.ceil(duration / 600); // quantos cortes de 10min

  const promises = [];
  
  for (let i = 0; i < totalCuts; i++) {
    const start = i * 600;
    const end = Math.min((i + 1) * 600, duration);
    const cutDuration = end - start;
  
    const outputFile = path.join(outputDir, `cut_${i + 1}.mp4`);
  
    const promise = new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .setStartTime(start)
        .setDuration(cutDuration)
        .output(outputFile)
        .on('end', () => {
          console.log(`✅ Corte ${i + 1} salvo: ${outputFile}`);
          resolve();
        })
        .on('error', (err) => {
          console.error(`❌ Erro no corte ${i + 1}:`, err.message);
          reject(err);
        })
        .run();
    });
  
    promises.push(promise);
  }
  
  await Promise.all(promises);
  console.log('🚀 Todos os cortes foram gerados com sucesso!');
}

function getVideoDuration(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .input(videoPath)    // <-- Aqui também, para garantir
      .ffprobe((err, metadata) => {
        if (err) {
          return reject(err);
        }
        resolve(metadata.format.duration);
      });
  });
}



