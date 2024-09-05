import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [NgIf, MatProgressSpinnerModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  
  loadingBool = input(false);
  constructor(){
    
    console.log(this.loadingBool())
  }
}
