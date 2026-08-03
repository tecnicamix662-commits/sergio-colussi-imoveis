/**
 * ImageService - Gerencia o upload e otimização de imagens para o imóvel.
 * 
 * Funcionalidades:
 * 1. Converte e comprime imagens locais (do computador) diretamente no navegador via Canvas (para WebP/JPEG leve).
 * 2. Suporta upload automático para o Cloudinary (caso variáveis NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME e UPLOAD_PRESET estejam definidas).
 * 3. Garante funcionamento 100% autônomo e sem servidor em hospedagens Vercel.
 */

export interface ProcessedImageResult {
  url: string;
  name: string;
  size: number;
}

export class ImageService {
  /**
   * Converte um arquivo de foto do computador para uma URL pronta para salvar no imóvel.
   */
  static async uploadImage(file: File): Promise<ProcessedImageResult> {
    // 1. Tenta fazer upload para a API do servidor (salva em public/uploads/ de forma permanente)
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return data.results[0];
        }
      }
    } catch (err) {
      console.warn('Upload via /api/upload indisponível, usando fallback:', err);
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    // Se as credenciais do Cloudinary estiverem configuradas, envia para o Cloudinary
    if (cloudName && uploadPreset) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          return {
            url: data.secure_url,
            name: file.name,
            size: data.bytes || file.size,
          };
        }
      } catch (err) {
        console.warn('Falha no upload via Cloudinary, utilizando otimização local:', err);
      }
    }

    // Fallback de otimização local (compressão e conversão para Data URL leve)
    const compressedDataUrl = await this.compressImage(file);
    return {
      url: compressedDataUrl,
      name: file.name,
      size: file.size,
    };
  }

  /**
   * Processa múltiplos arquivos em lote enviando para o servidor
   */
  static async uploadMultipleImages(
    files: FileList | File[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<ProcessedImageResult[]> {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileArray.length === 0) return [];

    // Tenta upload em lote direto para a API /api/upload
    try {
      const formData = new FormData();
      fileArray.forEach(f => formData.append('files', f));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.results && Array.isArray(data.results)) {
          if (onProgress) onProgress(fileArray.length, fileArray.length);
          return data.results;
        }
      }
    } catch (err) {
      console.warn('Upload em lote falhou, enviando individualmente:', err);
    }

    // Fallback item a item
    const results: ProcessedImageResult[] = [];
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const processed = await this.uploadImage(file);
      results.push(processed);

      if (onProgress) {
        onProgress(i + 1, fileArray.length);
      }
    }

    return results;
  }

  /**
   * Comprime e redimensiona imagens no navegador utilizando HTML Canvas
   */
  private static compressImage(file: File, maxWidth = 1600, maxHeight = 1200, quality = 0.82): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          // Redimensionamento proporcional se exceder os limites
          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          // Desenha a imagem no canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Tenta exportar para webp, se não suportado exporta para jpeg
          let dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Erro ao carregar a imagem selecionada.'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Erro ao ler o arquivo do dispositivo.'));
      reader.readAsDataURL(file);
    });
  }
}
