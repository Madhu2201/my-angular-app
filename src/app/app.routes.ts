import { Routes } from '@angular/router';
import { ComparisonDocumentComponent } from './comparison-document/comparison-document.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'comparison', component: ComparisonDocumentComponent }
];
