import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewMode } from '../../pdf-viewer/pdf-viewer';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
  standalone: true,
  imports: [CommonModule]
})
export class Toolbar {
  // Estado visual
  @Input() currentScale: number = 1;
  @Input() rotation: number = 0;
  @Input() ocrVisible: boolean = true;
  @Input() notesMode: boolean = false;

  // Estado de paginación (solo para documentos multipágina)
  @Input() currentPage?: number;
  @Input() totalPages?: number;
  @Input() showPagination: boolean = false;

  // Modo de vista (para PDFs y TIFFs multipágina)
  @Input() viewMode?: ViewMode;
  @Input() showViewModeToggle: boolean = false;

  // Tipo de documento (para mostrar/ocultar controles específicos)
  @Input() documentType?: 'pdf' | 'tiff' | 'image';

  // Eventos de zoom y ajuste
  @Output() zoomIn = new EventEmitter<void>();
  @Output() zoomOut = new EventEmitter<void>();
  @Output() setZoom = new EventEmitter<number>();
  @Output() rotate = new EventEmitter<void>();
  @Output() fitToWidth = new EventEmitter<void>();
  @Output() fitToPage = new EventEmitter<void>();
  @Output() resetView = new EventEmitter<void>();

  // Eventos de capas
  @Output() toggleOcr = new EventEmitter<void>();
  @Output() toggleNotes = new EventEmitter<void>();

  // Eventos de paginación
  @Output() goToPage = new EventEmitter<number>();
  @Output() nextPage = new EventEmitter<void>();
  @Output() prevPage = new EventEmitter<void>();

  // Eventos de modo de vista
  @Output() changeViewMode = new EventEmitter<ViewMode>();

  // Eventos de documento
  @Output() print = new EventEmitter<void>();
  @Output() download = new EventEmitter<void>();

  // Controles de zoom rápido
  zoomLevels = [50, 75, 100, 125, 150, 200];

  get canGoToPrevPage(): boolean {
    return !!this.currentPage && this.currentPage > 1;
  }

  get canGoToNextPage(): boolean {
    return !!this.currentPage && !!this.totalPages && this.currentPage < this.totalPages;
  }

  onQuickZoom(level: number) {
    this.setZoom.emit(level / 100);
  }

  onPageInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const page = parseInt(input.value, 10);
    if (page >= 1 && page <= (this.totalPages || 1)) {
      this.goToPage.emit(page);
    }
  }

  onViewModeChange(mode: ViewMode) {
    this.changeViewMode.emit(mode);
  }
}