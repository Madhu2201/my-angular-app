import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ComparisonDocumentComponent } from './comparison-document/comparison-document.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ComparisonDocumentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'my-angular-app';
}
