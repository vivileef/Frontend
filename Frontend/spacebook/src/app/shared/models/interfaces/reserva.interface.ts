// ==================== TABLA: reserva ====================
export interface Reserva {
  reservaid: string;
  usuarioid?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  costo?: number;
}

export interface CreateReservaDTO {
  usuarioid?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  costo?: number;
}

export interface UpdateReservaDTO extends Partial<CreateReservaDTO> {
  reservaid: string;
}
