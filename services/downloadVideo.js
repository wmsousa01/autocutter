// services/downloadVideo.js
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const downloadVideo = (youtubeUrl) => {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(__dirname, '..', 'uploads', 'video.mkv');

    const command = `yt-dlp -f "bv*+ba/best" -o "${outputPath}" ${youtubeUrl}`;
    console.log('Executando comando:', command);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Erro ao baixar vídeo:', stderr || error);
        return reject(`Erro ao baixar vídeo: ${stderr || error.message}`);
      }

      console.log('✅ Vídeo baixado em:', outputPath);
      resolve(outputPath);
    });
  });
};
