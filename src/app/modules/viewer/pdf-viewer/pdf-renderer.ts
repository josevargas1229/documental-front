import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';

@Injectable({
  providedIn: 'root'
})
export class PdfRenderer {
  private currentDoc: any = null;

  constructor() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }

  async loadDocument(url: string): Promise<any> {
    if (this.currentDoc) return this.currentDoc; // Cachea el doc
    const loadingTask = pdfjsLib.getDocument(url);
    this.currentDoc = await loadingTask.promise;
    console.log(`PDF cargado con ${this.currentDoc.numPages} páginas`);
    return this.currentDoc;
  }

  // Renderiza UNA página en un canvas
  async renderPage(doc: any, pageNum: number, canvas: HTMLCanvasElement, scale: number, rotation: number = 0) {
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale, rotation });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: canvas.getContext('2d')!,
      viewport
    };
    await page.render(renderContext).promise;
    return { width: viewport.width, height: viewport.height };
  }

  // Renderiza TODAS las páginas en un contenedor (para modo cascada)
  async renderAllPages(doc: any, container: HTMLElement, scale: number = 1.0, rotation: number = 0) {
    const numPages = doc.numPages;
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      const canvas = document.createElement('canvas');
      canvas.classList.add('mb-4', 'shadow-md', 'bg-white');
      container.appendChild(canvas);
      const dims = await this.renderPage(doc, i, canvas, scale, rotation);
      pages.push(dims);
    }
    return pages;
  }
}