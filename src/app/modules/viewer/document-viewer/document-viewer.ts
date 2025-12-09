import { Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfRenderer } from '../pdf-viewer/pdf-renderer';
import { PdfViewer } from '../pdf-viewer/pdf-viewer';

@Component({
  selector: 'app-document-viewer',
  standalone: true,
  imports: [CommonModule, PdfViewer],
  templateUrl: './document-viewer.html',
  styleUrl: './document-viewer.css',
})
export class DocumentViewer implements OnInit, OnChanges {
fileType: 'pdf' | 'tiff' | 'image' = 'pdf';
  // Servicios
  private pdfService = inject(PdfRenderer);

  // Inputs desde el Router (gracias a withComponentInputBinding)
  @Input() id!: string;

  // Estado
  docWidth = 0;
  docHeight = 0;
  currentUrl: string | null = null;

  // Ciclo de vida: Inicialización
  ngOnInit() {
    // Si hay un ID inicial, preparamos la carga
    if (this.id) {
      this.determinarUrlDelDocumento(this.id);
    }
  }

  // Ciclo de vida: Detección de cambios en la URL (Navegación)
  ngOnChanges(changes: SimpleChanges) {
    // Si cambia el ID y no es la primera vez (para evitar doble carga con ngOnInit)
    if (changes['id'] && !changes['id'].firstChange) {
      this.determinarUrlDelDocumento(this.id);
    }
  }

  

  // Lógica 1: Simular obtención de datos (BBDD o API)
  private determinarUrlDelDocumento(id: string) {
    console.log(`Buscando documento ID: ${id}`);

    // NOTA: En producción esto vendría de una API
    // CORRECCIÓN: Quitamos '/public'. Los assets se sirven desde la raíz.
    if (id === 'demo') {
      this.currentUrl = '/docs/test.pdf';
      this.fileType = 'pdf';
      
    } else {
      // Fallback para pruebas
      this.currentUrl = '/docs/test.pdf';
    }
  }

  
}