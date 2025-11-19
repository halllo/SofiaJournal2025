import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'settings-component',
  template: `
    <div class="">
      <h1>Settings</h1>
      <p>Adjust your preferences here.</p>
    </div>
  `,
  styles: ``,
})
export class SettingsComponent {
  // Add settings logic here using signals if needed
}
