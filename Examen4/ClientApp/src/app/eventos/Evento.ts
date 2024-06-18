//import { IDireccion } from "../direcciones/direccion";

export interface IEvento{
    id: number;
    nombre: string;
    descripcion: string;
    ubicacion: string;
    informacionContacto: string;
    fechaInicio: Date;
    fechaFin: Date;
    estado: string;
    //direcciones: IDireccion[];
}

