import { Component, ElementRef, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Toolbar as ToolbarComponent } from './toolbar/toolbar';
@Component({
  selector: 'app-base-viewer',
  imports: [ToolbarComponent],
  templateUrl: './base-viewer.html',
  styleUrl: './base-viewer.css',
})
export class BaseViewer {
  // @ViewChild('docCanvas') docCanvas!: ElementRef<HTMLCanvasElement>;
  // @ViewChild('notesLayer') notesLayer!: ElementRef<HTMLDivElement>;
  // @ViewChild('ocrLayer') ocrLayer!: ElementRef<HTMLDivElement>;
  ocrLayerVisible = true;
  notesModeActive = false;
  // Variables de Estado Visual
  scale = 1;
  rotation = 0;

  // Dimensiones del documento actual (se deben setear al cargar el archivo)
  @Input() contentWidth = 800;
  @Input() contentHeight = 1100;

  get transformStyle(): string {
    return `scale(${this.scale}) rotate(${this.rotation}deg)`;
  }

  // --- Acciones del Toolbar ---

  onZoomIn() {
    this.scale += 0.1;
  }

  onZoomOut() {
    if (this.scale > 0.2) this.scale -= 0.1;
  }

  onRotate() {
    this.rotation += 90;
  }
  fitToWidth() {
    // Asume que conoces el ancho del contenedor visible
    const containerWidth = window.innerWidth - 100; // margen aproximado
    this.scale = containerWidth / this.contentWidth;
  }

  fitToPage() {
    const containerWidth = window.innerWidth - 100;
    const containerHeight = window.innerHeight - 200; // toolbar + padding
    const scaleX = containerWidth / this.contentWidth;
    const scaleY = containerHeight / this.contentHeight;
    this.scale = Math.min(scaleX, scaleY);
  }

  toggleOcrLayer() {
    this.ocrLayerVisible = !this.ocrLayerVisible;
    // Aquí luego puedes emitir o actualizar el servicio ocr-overlay.service
  }

  toggleNotesMode() {
    this.notesModeActive = !this.notesModeActive;
  }

  printDocument() {
    window.print();
  }

  downloadOriginal() {
    // Debes recibir la URL original como @Input() downloadUrl
    if (this.downloadUrl) {
      const a = document.createElement('a');
      a.href = this.downloadUrl;
      a.download = '';
      a.click();
    }
  }

  @Input() downloadUrl?: string;
}
