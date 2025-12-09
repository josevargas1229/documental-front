import { Routes } from '@angular/router';
import { DocumentViewer } from './document-viewer/document-viewer';

export const VIEWER_ROUTES: Routes = [
    {
        path: ':id',
        component: DocumentViewer
    },
    {
        path: '**',
        redirectTo: 'dashboard',
    },
];