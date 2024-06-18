
import { IParticipante } from "./eventos-form/Participante";

export interface IEvento{
    id: number;
    nombre: string;
    descripcion: string;
    ubicacion: string;
    informacionContacto: string;
    fechaInicio: Date;
    fechaFin: Date;
    estado: string;
    participantes: IParticipante[];
}

