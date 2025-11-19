import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
  <main class="main">
    <stp-header
      [apps]="[]"
      [userAvatarItems]="userMenu"
      (userAvatarItemClicked)="navigate($event)"
      >
    </stp-header>
    <router-outlet />
  </main>
  `,
  styles: `
  `
})
export class App {
  private readonly router = inject(Router);
  protected readonly title = signal('Sofia Journal 2025');

  userMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-regular fa-user' },
    { id: 'settings', label: 'Settings', icon: 'fa-regular fa-gear' },
    { id: 'signout', label: 'Sign Out', icon: 'fa-regular fa-key' }
  ];

  navigate(event: CustomEvent<string>) {
    this.router.navigate([event.detail]);
  }
}
