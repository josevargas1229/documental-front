import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing-module';
import { Admin } from './admin';
import { AuditoriaView } from './pages/auditoria/auditoria.view';
import { DashboardView } from './pages/dashboard/dashboard.view';
import { DigitalizacionView } from './pages/digitalizacion/digitalizacion.view';
import { ExpedientesView } from './pages/expedientes/expedientes.view';
import { ReportesView } from './pages/reportes/reportes.view';
import { RespaldosView } from './pages/respaldos/respaldos.view';
import { UsuariosView } from './pages/usuarios/usuarios.view';
import { Header } from './components/header/header';
import { Sidebar } from './components/sidebar/sidebar';
import { Explorer } from './pages/expedientes/explorer/explorer';
import { Node } from './pages/expedientes/explorer/node/node';
import { Metadata } from './pages/expedientes/metadata/metadata';
import { Viewer } from './pages/expedientes/viewer/viewer';
import { HttpClientModule } from '@angular/common/http';
import { TreeNodeComponent } from './pages/expedientes/explorer/tree-node/tree-node';
import { FormsModule } from '@angular/forms';
import { BusquedaView } from './pages/busqueda/busqueda.view';

@NgModule({
  declarations: [
    Admin,
    AuditoriaView,
    DashboardView,
    DigitalizacionView,
    ExpedientesView,
    ReportesView,
    RespaldosView,
    UsuariosView,
    BusquedaView,
    Header,
    Sidebar,
    Explorer,
    Node,
    Metadata,
    Viewer,
    TreeNodeComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule

  ]
})
export class AdminModule { }
