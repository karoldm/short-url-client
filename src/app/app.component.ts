import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShortUrlService } from './services/short-url.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatProgressSpinnerModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  originalUrl = signal('');
  shortUrl = "";
  // value in secs
  expirationTime = signal(0);
  isLoading = signal(false);
  snackBar = inject(MatSnackBar);
  disableButtons = computed(() => this.originalUrl().trim() == '' || this.expirationTime() <= 0);

  expirationTimes = [
    { value: 30 * 60, label: '30 min' },
    { value: 1 * 60 * 60, label: '1 hora' },
    { value: 12 * 60 * 60, label: '12 horas' },
    { value: 24 * 60 * 60, label: '1 dia' },
    { value: 7 * 24 * 60 * 60, label: '7 dias' },
  ];

  constructor(private shortUrlService: ShortUrlService) {}

  async onGenerate()  {
    if (this.disableButtons()) return;

    this.isLoading.set(true);

    try {
      this.shortUrlService.onGenerate(
        this.originalUrl(),
        this.expirationTime()).subscribe(
          (response) => {
            this.shortUrl = environment.apiUrl + "/" + response.code;
            this.snackBar.open("URL gerada com sucesso!");
          }
        );
    } catch (err) {
      this.snackBar.open('Tivemos um problema ao encurtar essa URL.');
    } finally {
      this.isLoading.set(false);
    }
  }

  onCopy() {
    navigator.clipboard.writeText(this.shortUrl);
    this.snackBar.open("Link copiado com sucesso!");
  }

  onSelectExpirationTime(value: number){
    this.expirationTime.set(value);
  }
  onChangeOriginalUrl(event: Event) {
    const target = event.target as HTMLInputElement;
    this.originalUrl.set(target.value);
  }
}
