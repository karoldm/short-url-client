import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

type Response = {
  code: string
}

@Injectable({
  providedIn: 'root'
})
export class ShortUrlService {
  constructor(private http: HttpClient) {}

  onGenerate(originalUrl: string, expirationTime: number): Observable<Response>  {
    try {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      const payload = {
        originalUrl: originalUrl,
        expirationTime: expirationTime * 1000 + Date.now()
      };

      return this.http.post<Response>(
        environment.apiUrl + '/create',
        payload,
        { headers }
      );

    } catch (err) {
      console.error('Error generating short URL:', err);
      throw err;
    }
  }
}
