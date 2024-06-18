import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { IEvento } from './Evento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private apiURL = this.baseUrl + "eventos"

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string ) { }

  // Método para obtener eventos
  getEventos(): Observable<IEvento[]> {
    return this.http.get<IEvento[]>(this.apiURL);
  }

  getEvento(eventoId: string): Observable<IEvento>{
    let params = new HttpParams().set('incluirParticipantes',"true")
    return this.http.get<IEvento>(this.apiURL + '/' + eventoId, { params: params})
  }

  createEvento(evento: IEvento):Observable<IEvento>{
    return this.http.post<IEvento>(this.apiURL, evento)
  }
  // solo para actualizar participantes
  updateEvento(evento:IEvento):Observable<IEvento>{
    return this.http.put<IEvento>(this.apiURL+"/"+evento.id.toString(),evento);
  }

}
