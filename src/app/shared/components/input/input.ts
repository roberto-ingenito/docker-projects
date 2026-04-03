import { Component } from '@angular/core';

let nextId = 0;

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class Input {
  inputId = `input-${nextId++}`;
}
