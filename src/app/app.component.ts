import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { StepperComponent } from './stepper/stepper.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StepperComponent, CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GoogleSheetsApp';
}
