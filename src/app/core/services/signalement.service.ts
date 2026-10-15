import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalementService {
  private apiUrl = 'http://localhost:5000/api/reports';

  constructor(private http: HttpClient) {}

  creerSignalement(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}