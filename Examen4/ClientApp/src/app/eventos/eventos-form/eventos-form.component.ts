import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IEvento } from '../Evento';
import { EventosService } from '../eventos.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-eventos-form',
  templateUrl: './eventos-form.component.html',
  styleUrls: ['./eventos-form.component.css'],
  providers: [DatePipe]
})
export class EventosFormComponent implements OnInit {
  formGroup!: FormGroup;
  //modoVerDetalle: boolean = false; // Set this based on your logic
  eventoId! : number;

  modoAgregar: boolean = false;
  modoVerDetalle: boolean = false;
  modoInscribirParticipane: boolean = false;

  constructor(private fb: FormBuilder,
              private eventoService: EventosService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private datePipe: DatePipe,) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      ubicacion: ['', Validators.required],
      informacionContacto: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      estado: { value: 'Activo', disabled: this.modoVerDetalle }
    });

    
    this.activatedRoute.params.subscribe(params => {
      if (params['id'] === undefined) {
        this.modoAgregar = true;// a
        return;
      }
      //this.modoVerDetalle = true;

      this.eventoId = params['id'];

      const urlSegments = this.activatedRoute.snapshot.url.map(segment => segment.path);
      if (urlSegments.includes('inscribir-participante')) {
        this.modoInscribirParticipane = true;
      } else {
        this.modoVerDetalle = true;
      }

//
      this.eventoId = params['id'];
      this.eventoService.getEvento(this.eventoId.toString())
        .subscribe(evento => this.cargarFormulario(evento),
                   error => console.error(error));
    });


    if (this.modoVerDetalle  || this.modoInscribirParticipane) { //a
      this.formGroup.disable();
    }
  }

  cargarFormulario(evento : IEvento){
    const format = 'yyyy-MM-dd';

    this.formGroup.patchValue({
      nombre: evento.nombre,
      descripcion: evento.descripcion,
      ubicacion: evento.ubicacion,
      informacionContacto: evento.informacionContacto,
      fechaInicio: this.datePipe.transform(evento.fechaInicio, format),
      fechaFin: this.datePipe.transform(evento.fechaFin, format),
      estado: evento.estado
    })
  }

  save() {
    if (this.modoVerDetalle ) return;//a

    let evento: IEvento = Object.assign({}, this.formGroup.value);
    console.table(evento);

    //this.if(this.modoVerDetalle)
    if(this.modoInscribirParticipane){
      //EDITAR EL REGISTRO
      evento.id = this.eventoId
      //console.log(this.eventoId);
      this.eventoService.updateEvento(evento)
        .subscribe(evento => this.onSaveSuccess(),
        error => console.error(error)
      )
    }else{ 
      //AGREGAR REGISTRO
    this.eventoService.createEvento(evento)
      .subscribe(evento => this.onSaveSuccess(),
                 error => console.error(error));
    }

  }

  //   if (this.modoEdicion) {
  //     persona.id = this.personaId;

  //     this.personaService.updatePersona(persona)
  //       .subscribe(() => this.borrarDirecciones(),
  //                  error => console.error(error));
  //   } else {
  //     this.personaService.createPersona(persona)
  //       .subscribe(() => this.onSaveSuccess(),
  //                  error => console.error(error));
  //   }
  // }








  onSaveSuccess() {
    this.router.navigate(['/eventos']);
  }
}
