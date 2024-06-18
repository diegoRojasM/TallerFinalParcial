import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipantesService {
  private apiURL = this.baseUrl + "participantes"

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string ) { }

  deleteParticipantes(ids: number[]): Observable<void> {
    return this.http.post<void>(this.apiURL + "/delete/list", ids);
  }
}