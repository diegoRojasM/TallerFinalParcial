import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { IPersona } from '../IPersona';
import { PersonasService } from '../personas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DireccionesService } from 'src/app/direcciones/direcciones.service';

@Component({
  selector: 'app-personas-form',
  templateUrl: './personas-form.component.html',
  styleUrls: ['./personas-form.component.css'],
  providers: [DatePipe] // Asegura que DatePipe esté disponible
})
export class PersonasFormComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private personaService: PersonasService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private direccionesService: DireccionesService,
  ) {}

  modoEdicion: boolean = false;
  formGroup!: FormGroup;
  personaId!: number;
  direccionesABorrar: number[] = [];

  ignorarExistenCambiosPendientes: boolean = false;

  existenCambiosPendientes(): boolean {
    if (this.ignorarExistenCambiosPendientes) { return false; };
    return !this.formGroup.pristine; // si el formulario ha sido editado o no
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      nombre: '',
      fechaNacimiento: '',
      direcciones: this.fb.array([])
    });

    this.activatedRoute.params.subscribe(params => {
      if (params['id'] === undefined) {
        return;
      }
      this.modoEdicion = true;

      this.personaId = params['id'];
      this.personaService.getPersona(this.personaId.toString())
        .subscribe(persona => this.cargarFormulario(persona),
                   error => console.error(error));
    });
  }

  get direcciones(): FormArray {
    return this.formGroup.get('direcciones') as FormArray;
  }

  agregarDireccion() {
    this.direcciones.push(this.construirDireccion());
  }

  construirDireccion() {
    return this.fb.group({
      id: 0,
      calle: '',
      provincia: '',
      personaId: this.personaId || 0
    });
  }

  removerDireccion(index: number) {
    let direccionRemover = this.direcciones.at(index) as FormGroup;
    if (direccionRemover.controls['id'].value != '0') {
      this.direccionesABorrar.push(<number>direccionRemover.controls['id'].value);
    }
    this.direcciones.removeAt(index);
  }

  cargarFormulario(persona: IPersona) {
    const format = 'yyyy-MM-dd';

    this.formGroup.patchValue({
      nombre: persona.nombre,
      fechaNacimiento: this.datePipe.transform(persona.fechaNacimiento, format)
    });

    const direccionesFormArray = this.fb.array(
      persona.direcciones.map(direccion => this.fb.group(direccion))
    );
    this.formGroup.setControl('direcciones', direccionesFormArray);
    
    //esto es lo mismo que lo de arriba

    // let direcciones = this.formGroup.controls['direcciones'] as FormArray;
    // persona.direcciones.forEach(direccion => {
    //   let direccionFG = this.construirDireccion();
    //   direccionFG.patchValue(direccion);
    //   direcciones.push(direccionFG);
    // });

    //esto igual  es lo mismo que lo de arriba

    // const direccionesFormArray = this.fb.array(
    //   persona.direcciones.map(direccion => this.fb.group({
    //     id: direccion.id.toString(),
    //     calle: direccion.calle,
    //     provincia: direccion.provincia,
    //     personaId: direccion.personaId
    //   }))
    // );
  
    // this.formGroup.setControl('direcciones', direccionesFormArray);

  }

  save() {
    this.ignorarExistenCambiosPendientes = true;
    let persona: IPersona = Object.assign({}, this.formGroup.value);
    console.table(persona);

    if (this.modoEdicion) {
      persona.id = this.personaId;

      this.personaService.updatePersona(persona)
        .subscribe(() => this.borrarDirecciones(),
                   error => console.error(error));
    } else {
      this.personaService.createPersona(persona)
        .subscribe(() => this.onSaveSuccess(),
                   error => console.error(error));
    }
  }

  borrarDirecciones(){
    if (this.direccionesABorrar.length === 0) {
      this.onSaveSuccess();
      return;
    }
    this.direccionesService.deleteDirecciones(this.direccionesABorrar)
      .subscribe(() => this.onSaveSuccess(),
        error => console.error(error));
  }

  onSaveSuccess() {
    this.router.navigate(['/personas']);
  }
}
