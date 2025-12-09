import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  standalone: false,
  templateUrl: './busqueda.view.html',
})
export class BusquedaView implements OnInit {

  searchForm: FormGroup;

  resultsCount = 3;

  // --- Catálogos ---
  allDocumentTypes = ['Todos', 'Opción 1', 'Opción 2'];
  filteredDocumentTypes: string[] = [...this.allDocumentTypes];

  allEstados = ['Hidalgo', 'Estado de México', 'Puebla', 'Querétaro'];
  
  allSeries = ['Contratos', 'Manuales', 'Actas', 'Servicios', 'Procedimientos', 'Rutas'];
  filteredSeries: string[] = [...this.allSeries]; 

  municipiosData = {
    'Hidalgo': ['Pachuca', 'Tulancingo', 'Ixmiquilpan', 'Tula', 'Actopan'],
    'Estado de México': ['Toluca', 'Naucalpan', 'Ecatepec'],
    'Puebla': ['Puebla de Zaragoza', 'Cholula'],
    'Querétaro': ['Querétaro', 'San Juan del Río']
  } as const;

  filteredEstados: string[] = [...this.allEstados];
  filteredMunicipios: string[] = [];

  mockResults = [
    {
      id: 1,
      title: 'Contrato de Servicios Tecnológicos',
      type: 'PDF',
      expedient: 'EXP-2024-001',
      location: 'Fondo: Administración > Sección: Contratos > Serie: Servicios',
      owner: 'María García',
      date: '2024-01-15',
      tags: 'Contrato, Tecnología, Infraestructura',
    },
    {
      id: 2,
      title: 'Manual de Procedimientos IT',
      type: 'DOCX',
      expedient: 'EXP-2024-004',
      location: 'Fondo: IT > Sección: Manuales > Serie: Procedimientos',
      owner: 'Juan Pérez',
      date: '2023-11-20',
      tags: 'Reglamento, IT, Auditoría',
    },
    {
      id: 3,
      title: 'Acta de Cabildo - Ruta 18',
      type: 'IMG/JPEG',
      expedient: 'EXP-1998-055',
      location: 'Fondo: Transporte > Sección: Rutas > Serie: Actas',
      owner: 'Entidad de Gobierno',
      date: '1998-05-10',
      tags: 'Acta, Cabildo, Ruta',
    },
  ];

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      expedientNumber: [''],
      ownerName: [''], 
      documentType: ['Todos'], 
      serie: [''],
      startDate: [''],
      endDate: [''],
      estado: [''],
      municipio: [{ value: '', disabled: true }], // ⬅️ CAMBIO 1: Deshabilitar por defecto
      projects: [''],
    });
  }

  ngOnInit(): void {
    // Filtrar tipo documental
    this.searchForm.get('documentType')?.valueChanges.subscribe(value => {
      this.filteredDocumentTypes = this.filterArray(this.allDocumentTypes, value);
    });
    
    // ⬅️ CAMBIO 2: Añadir la lógica de filtrado para Serie
    this.searchForm.get('serie')?.valueChanges.subscribe(value => {
      this.filteredSeries = this.filterArray(this.allSeries, value);
    });

    // Estado → reinicia y controla municipio
    this.searchForm.get('estado')?.valueChanges.subscribe(estado => {
      const municipioControl = this.searchForm.get('municipio') as FormControl;

      if (estado) {
        const key = estado as keyof typeof this.municipiosData;
        const municipios = this.municipiosData[key] || [];
        this.filteredMunicipios = [...municipios];
        municipioControl.enable({ emitEvent: false }); 
      } else {
        this.filteredMunicipios = [];
        municipioControl.disable({ emitEvent: false }); 
      }
      
      this.filteredEstados = this.filterArray(this.allEstados, estado);
      municipioControl.setValue('', { emitEvent: false });
    });

    // Filtrado de municipio dependiente
    this.searchForm.get('municipio')?.valueChanges.subscribe(value => {
      const estadoActual = this.searchForm.get('estado')?.value;
      const key = estadoActual as keyof typeof this.municipiosData;
      const municipiosBase = this.municipiosData[key] || [];

      this.filteredMunicipios = this.filterArray([...municipiosBase], value);
    });
  }

  filterArray(baseArray: string[], value: string): string[] {
    const filterValue = value?.toLowerCase() || '';
    return baseArray.filter(item => item.toLowerCase().includes(filterValue));
  }

  handleSearch(): void {
    const data = this.searchForm.value;
    console.log('Búsqueda ejecutada:', data);

    if (Object.values(data).some(v => v && v !== 'Todos')) {
      this.resultsCount = Math.floor(Math.random() * 5) + 3;
    } else {
      this.resultsCount = 0;
    }
  }

  resetFilters(): void {
    this.searchForm.reset({
      documentType: 'Todos',
      estado: '',
    });

    this.filteredDocumentTypes = [...this.allDocumentTypes];
    this.filteredEstados = [...this.allEstados];
    this.filteredMunicipios = [];
    this.filteredSeries = [...this.allSeries]; // ⬅️ Limpiar filtro de Serie
    
    this.searchForm.get('municipio')?.disable({ emitEvent: false });
    this.searchForm.get('municipio')?.setValue('', { emitEvent: false }); 

    this.resultsCount = 0;
  }

  loadMoreResults(): void {
    this.resultsCount += 3;
  }

  exportResults(): void {
    console.log('Exportando...');
  }
}
