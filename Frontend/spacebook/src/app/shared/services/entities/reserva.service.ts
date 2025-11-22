import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';
import { Reserva, CreateReservaDTO, UpdateReservaDTO } from '../../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.apiUrl, environment.apiKey);
  }

  async getReservas(usuarioId?: string): Promise<Reserva[]> {
    let query = this.supabase.from('reserva').select('*');
    
    if (usuarioId) {
      query = query.eq('usuarioid', usuarioId);
    }
    
    query = query.order('fecha_inicio', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async getReserva(id: string): Promise<Reserva | null> {
    const { data, error } = await this.supabase
      .from('reserva')
      .select('*')
      .eq('reservaid', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createReserva(reserva: CreateReservaDTO): Promise<Reserva> {
    const { data, error } = await this.supabase
      .from('reserva')
      .insert([reserva])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateReserva(reserva: UpdateReservaDTO): Promise<Reserva> {
    const { reservaid, ...updates } = reserva;
    
    const { data, error } = await this.supabase
      .from('reserva')
      .update(updates)
      .eq('reservaid', reservaid)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteReserva(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('reserva')
      .delete()
      .eq('reservaid', id);

    if (error) throw error;
  }

  async getReservasActivas(usuarioId: string): Promise<Reserva[]> {
    const now = new Date().toISOString();
    const { data, error } = await this.supabase
      .from('reserva')
      .select('*')
      .eq('usuarioid', usuarioId)
      .gte('fecha_fin', now)
      .order('fecha_inicio', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}
