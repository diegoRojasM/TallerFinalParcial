import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IEvento } from '../Evento';
import { EventosService } from '../eventos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantesService } from 'src/app/participantes/participantes.service';

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
  participantesABorrar: number[] = [];


  constructor(private fb: FormBuilder,
              private eventoService: EventosService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private datePipe: DatePipe,
              private participantesService: ParticipantesService) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      ubicacion: ['', Validators.required],
      informacionContacto: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      estado: { value: 'Activo', disabled: this.modoVerDetalle },
      participantes: this.fb.array([])
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


  get participantes(): FormArray {
    return this.formGroup.get('participantes') as FormArray;
  }

  agregarParticipante() {
    this.participantes.push(this.construirParticipante());
  }

  construirParticipante(): FormGroup {
    return this.fb.group({
      id: 0,
      nombre: '',
      direccion: '',
      fechaNacimiento: '',
      correo: '',
      numeroTelefono: '',
      organizacion: '',
      profesion: '',
      cargo: '',
      eventoId: this.eventoId != null ? this.eventoId : 0
    });
  }

  removerParticipante(index : number) {
    let participanteRemover = this.participantes.at(index) as FormGroup;
    if (participanteRemover.controls['id'].value != '0') {
      this.participantesABorrar.push(<number>participanteRemover.controls['id'].value);
    }
    this.participantes.removeAt(index);
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
    });

    const participantesFormArray = this.fb.array(
      evento.participantes.map(participante => this.fb.group(participante))
    );
    this.formGroup.setControl('participantes', participantesFormArray);
    // let participantes = this.formGroup.controls['participantes'] as FormArray;
    // evento.participantes.forEach(participante => {
    //   let participanteFG = this.construirParticipante();
    //   participanteFG.patchValue(participante);
    //   participantes.push(participanteFG);
    // })

  }


  save() {
    if (this.modoVerDetalle && this.modoAgregar ) return;//a

    let evento: IEvento = Object.assign({}, this.formGroup.value);
    console.table(evento);


    

    if(this.modoInscribirParticipane){
      //EDITAR EL REGISTRO
      evento.id = this.eventoId
      //console.log(this.eventoId);
      this.eventoService.updateEvento(evento)
        .subscribe(evento => this.borrarParticipante(),
        error => console.error(error)
      )
    }else{ 
      //AGREGAR REGISTRO
    this.eventoService.createEvento(evento)
      .subscribe(evento => this.onSaveSuccess(),
                 error => console.error(error));
    }

  }

  borrarParticipante(){
    if(this.participantesABorrar.length===0){
      this.onSaveSuccess();
      return;
    }

    this.participantesService.deleteParticipantes(this.participantesABorrar)
      .subscribe(()=> this.onSaveSuccess(),
        error => console.error(error))
  }



  onSaveSuccess() {
    this.router.navigate(['/eventos']);
  }
}