import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class DownloadService {

  /**
   * Télécharger un blob (fichier)
   */
  downloadBlob(blob: Blob, fileName: string): void {
    try {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      this.fallbackDownload(blob, fileName);
    }
  }

  /**
   * Fallback pour les navigateurs qui ne supportent pas
   */
  private fallbackDownload(blob: Blob, fileName: string): void {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const url = window.URL.createObjectURL(blob);
    iframe.src = url;

    setTimeout(() => {
      document.body.removeChild(iframe);
      window.URL.revokeObjectURL(url);
    }, 1000);
  }

  /**
   * Télécharger depuis une URL
   */
  downloadFromUrl(url: string, fileName: string): void {
    fetch(url)
      .then(response => response.blob())
      .then(blob => this.downloadBlob(blob, fileName))
      .catch(error => console.error('Erreur téléchargement:', error));
  }

  /**
   * Télécharger du texte
   */
  downloadText(content: string, fileName: string, mimeType: string = 'text/plain'): void {
    const blob = new Blob([content], { type: mimeType });
    this.downloadBlob(blob, fileName);
  }

  /**
   * Télécharger du JSON
   */
  downloadJson(data: any, fileName: string): void {
    const json = JSON.stringify(data, null, 2);
    this.downloadText(json, fileName, 'application/json');
  }

  /**
   * Télécharger un fichier CSV
   */
  downloadCsv(data: any[][], headers: string[], fileName: string): void {
    const csvContent = [headers, ...data].map(row => row.join(',')).join('\n');
    this.downloadText(csvContent, fileName, 'text/csv;charset=utf-8;');
  }
}
