// ==================== TABLA: seccion ====================
export interface Seccion {
  seccionid: string;
  institucionid?: string;
  nombre: string;
  tipo?: string;
  capacidad?: number;
  calificacion?: number;
}

export interface CreateSeccionDTO {
  institucionid?: string;
  nombre: string;
  tipo?: string;
  capacidad?: number;
  calificacion?: number;
}

export interface UpdateSeccionDTO extends Partial<CreateSeccionDTO> {
  seccionid: string;
}
