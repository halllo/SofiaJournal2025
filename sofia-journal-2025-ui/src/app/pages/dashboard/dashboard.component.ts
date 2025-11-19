import { ChangeDetectionStrategy, Component, signal, inject, effect, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'dashboard-root',
  template: `
    <section class="dashboard-container">
      <h1>Sofia Journal 2025</h1>
      <form (submit)="addEntry($event)" class="input-box-form">
        <input
          type="text"
          [value]="inputValue()"
          (input)="inputValue.set($event.target.value)"
          name="entryInput"
          placeholder="Add new entry..."
          required
          autocomplete="off"
        />
        <button type="submit">Add</button>
      </form>
      <ul class="entry-list">
        @for (entry of entriesReversed(); track $index) {
          <li>{{ entry.content }}</li>
        }
      </ul>
    </section>
  `,
  styles: `
    .dashboard-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
    }
    .entry-list {
      list-style: none;
      padding: 0;
      margin-bottom: 1.5rem;
      width: 100%;
      max-width: 400px;
    }
    .entry-list li {
      background: #f3f3f3;
      margin-bottom: 0.5rem;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      font-size: 1rem;
    }
    .input-box-form {
      display: flex;
      gap: 0.5rem;
      width: 100%;
      max-width: 400px;
      margin-bottom: 2rem;
    }
    .input-box-form input {
      flex: 1;
      padding: 0.5rem 0.75rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
    }
    .input-box-form button {
      padding: 0.5rem 1rem;
      border: none;
      background: #1976d2;
      color: #fff;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .input-box-form button:hover {
      background: #1565c0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly http = inject(HttpClient);
  protected readonly entries = signal<JournalEntry[]>([]);
  protected readonly entriesReversed = computed(() => [...this.entries()].reverse());
  protected readonly inputValue = signal('');

  protected loadEntries = effect(async () => {
    try {
      const journalentries = await firstValueFrom(this.http.get<JournalEntry[]>(`${environment.apiPath}/journalentries`));
      this.entries.set(journalentries ?? []);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      alert('Failed to fetch journal entries. Please try again later.');
    }
  });

  async addEntry(event: Event) {
    event.preventDefault();
    const value = this.inputValue().trim();
    if (!value) return;

    try {
      const response = await firstValueFrom(this.http.post<JournalEntry>(`${environment.apiPath}/journalentries`, { content: value }))
      this.entries.update(entries => [...entries, response]);
      this.inputValue.set('');
    } catch (error) {
      console.error('Error adding journal entry:', error);
      alert('Failed to add journal entry. Please try again later.');
    }
  }
}

interface JournalEntry {
    id: number;
    content: string;
}
