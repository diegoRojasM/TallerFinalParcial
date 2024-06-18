import { Component } from '@angular/core';
import { IEvento } from './Evento';
import { EventosService } from './eventos.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent {

  eventos: IEvento[]=[];

  constructor(private eventosService: EventosService) {
    // Aquí podrías inicializar eventos con datos obtenidos de algún servicio o fuente de datos
    this.eventos = []
  }

  ngOnInit(){
    this.eventosService.getEventos()
    .subscribe(event => this.eventos = event,
      error => console.error(error));
  }




  delete(_t21: IEvento) {
    console.log('Method not implemented.');
    }

}