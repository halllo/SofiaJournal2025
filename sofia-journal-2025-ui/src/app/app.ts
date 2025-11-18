import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
  <stp-header
    [disableNavigationButton]="true"
    [apps]="[]">
  </stp-header>
  <main class="main">

    <div style="margin: 1rem;">
      <h1 class="header">{{ title() }}</h1>
      <stp-button variant="filled" size="default">
        Button
      </stp-button>
      <router-outlet />
    </div>
  </main>
  `,
  styles: `
  `
})
export class App {
  protected readonly title = signal('Sofia Journal 2025');
}
