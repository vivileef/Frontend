// ==================== TABLA: institucion ====================
export interface Institucion {
  institucionid: string;
  nombre: string;
  tipo?: string;
  direccion?: string;
  servicio?: string;
  horarioid?: string;
  imagenUrl?: string[];
}

export interface CreateInstitucionDTO {
  nombre: string;
  tipo?: string;
  direccion?: string;
  servicio?: string;
  imagenUrl?: string;
  horarioid?: string;
}

export interface UpdateInstitucionDTO extends Partial<CreateInstitucionDTO> {
  institucionid: string;
  horarioid?: string;
}
