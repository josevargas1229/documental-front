import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseViewer } from '../base-viewer/base-viewer';
import { PdfRenderer } from './pdf-renderer';
import { Toolbar } from '../base-viewer/toolbar/toolbar';

export type ViewMode = 'paginated' | 'cascade';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, BaseViewer, Toolbar],
  templateUrl: './pdf-viewer.html',
  styleUrl: './pdf-viewer.css',
})
export class PdfViewer implements AfterViewInit, OnChanges {
  @Input() url!: string;
  @Input() scale = 1;

  @ViewChild('docCanvas') set docCanvasRef(el: ElementRef<HTMLCanvasElement>) {
    if (el) {
      this.canvas = el;
      if (this.viewMode === 'paginated' && this.doc && !this.renderInProgress) {
        this.renderSinglePage(this.currentPage);
      }
    }
  }

  canvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('cascadeContainer', { static: false }) cascadeContainer?: ElementRef<HTMLDivElement>;

  pageWidth = 0;
  pageHeight = 0;
  isLoading = true;
  currentPage = 1;
  totalPages = 0;
  rotation = 0;
  ocrVisible = true;
  notesMode = false;
  viewMode: ViewMode = (localStorage.getItem('pdfViewMode') as ViewMode) || 'paginated';

  private doc: any = null;
  private renderInProgress = false;
  // Guardamos las dimensiones originales de la página (sin escala ni rotación)
  private originalPageWidth = 0;
  private originalPageHeight = 0;

  constructor(
    private pdfRenderer: PdfRenderer,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    if (this.url) this.loadAndRender();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['url'] && this.url) {
      this.isLoading = true;
      this.currentPage = 1;
      this.loadAndRender();
    }
  }

  // ============ Métodos del Toolbar ============

  onZoomIn() {
    this.scale = Math.min(this.scale + 0.1, 3);
    this.rerender();
  }

  onZoomOut() {
    this.scale = Math.max(this.scale - 0.1, 0.2);
    this.rerender();
  }

  onSetZoom(newScale: number) {
    this.scale = newScale;
    this.rerender();
  }

  onRotate() {
    this.rotation = (this.rotation + 90) % 360;
    this.rerender();
  }

  onFitToWidth() {
    if (this.originalPageWidth <= 0) return;
    
    const containerWidth = window.innerWidth - 200;
    
    // Usar dimensiones originales, considerando rotación
    const isRotated = this.rotation === 90 || this.rotation === 270;
    const refWidth = isRotated ? this.originalPageHeight : this.originalPageWidth;
    
    this.scale = containerWidth / refWidth;
    this.scale = Math.max(0.2, Math.min(3, this.scale)); // Limitar entre 0.2 y 3
    this.rerender();
  }

  onFitToPage() {
    if (this.originalPageWidth <= 0 || this.originalPageHeight <= 0) return;
    
    const containerWidth = window.innerWidth - 200;
    const containerHeight = window.innerHeight - 200;
    
    // Usar dimensiones originales, considerando rotación
    const isRotated = this.rotation === 90 || this.rotation === 270;
    const refWidth = isRotated ? this.originalPageHeight : this.originalPageWidth;
    const refHeight = isRotated ? this.originalPageWidth : this.originalPageHeight;
    
    const scaleX = containerWidth / refWidth;
    const scaleY = containerHeight / refHeight;
    this.scale = Math.min(scaleX, scaleY);
    this.scale = Math.max(0.2, Math.min(3, this.scale)); // Limitar entre 0.2 y 3
    this.rerender();
  }

  onResetView() {
    this.scale = 1;
    this.rotation = 0;
    this.rerender();
  }

  onToggleOcr() {
    this.ocrVisible = !this.ocrVisible;
  }

  onToggleNotes() {
    this.notesMode = !this.notesMode;
  }

  onNextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  onPrevPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  onGoToPage(page: number) {
    this.goToPage(page);
  }

  onChangeViewMode(mode: ViewMode) {
    this.viewMode = mode;
    localStorage.setItem('pdfViewMode', this.viewMode);
    this.loadAndRender();
  }

  onPrint() {
    fetch(this.url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);

        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.style.visibility = 'hidden';

        iframe.src = blobUrl;
        document.body.appendChild(iframe);

        iframe.onload = () => {
          setTimeout(() => {
            try {
              if (iframe.contentWindow) {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
              }
            } catch (e) {
              console.error('Error al invocar impresión', e);
            } finally {
              setTimeout(() => {
                if (document.body.contains(iframe)) {
                  document.body.removeChild(iframe);
                }
                URL.revokeObjectURL(blobUrl);
              }, 60000);
            }
          }, 500);
        };
      })
      .catch(err => {
        console.error('Error al imprimir:', err);
      });
  }

  onDownload() {
    if (this.url) {
      const a = document.createElement('a');
      a.href = this.url;
      a.download = '';
      a.click();
    }
  }

  private async loadAndRender() {
    if (!this.url || this.renderInProgress) return;

    this.renderInProgress = true;
    this.isLoading = true;

    try {
      if (!this.doc) {
        this.doc = await this.pdfRenderer.loadDocument(this.url);
        this.totalPages = this.doc.numPages;
        
        // Obtener dimensiones originales de la primera página
        const firstPage = await this.doc.getPage(1);
        const originalViewport = firstPage.getViewport({ scale: 1, rotation: 0 });
        this.originalPageWidth = originalViewport.width;
        this.originalPageHeight = originalViewport.height;
      }

      setTimeout(async () => {
        if (this.viewMode === 'paginated') {
          await this.renderSinglePage(this.currentPage);
        } else {
          await this.renderCascade();
        }
        this.isLoading = false;
        this.renderInProgress = false;
        this.cdr.detectChanges();
      }, 0);

    } catch (err) {
      console.error('Error renderizando PDF:', err);
      this.isLoading = false;
      this.renderInProgress = false;
    }
  }

  private async renderSinglePage(pageNum: number) {
    if (!this.canvas?.nativeElement || !this.doc) return;

    const canvasEl = this.canvas.nativeElement;
    const page = await this.doc.getPage(pageNum);

    // Aplicar escala y rotación
    const viewport = page.getViewport({
      scale: this.scale,
      rotation: this.rotation
    });

    this.pageWidth = viewport.width;
    this.pageHeight = viewport.height;

    canvasEl.width = viewport.width;
    canvasEl.height = viewport.height;

    this.cdr.detectChanges();

    await this.pdfRenderer.renderPage(
      this.doc,
      pageNum,
      canvasEl,
      this.scale,
      this.rotation
    );
  }

  private async renderCascade() {
    if (!this.cascadeContainer || !this.doc) return;

    this.cascadeContainer.nativeElement.innerHTML = '';
    await this.pdfRenderer.renderAllPages(
      this.doc,
      this.cascadeContainer.nativeElement,
      this.scale,
      this.rotation
    );
  }

  private rerender() {
    if (this.viewMode === 'paginated') {
      this.renderSinglePage(this.currentPage);
    } else {
      this.renderCascade();
    }
  }

  goToPage(page: number) {
    if (
      page < 1 ||
      page > this.totalPages ||
      this.viewMode !== 'paginated' ||
      this.renderInProgress ||
      page === this.currentPage
    )
      return;

    this.currentPage = page;
    this.renderSinglePage(page);
  }
}