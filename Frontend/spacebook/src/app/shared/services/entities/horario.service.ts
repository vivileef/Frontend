import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';
import { Horario, CreateHorarioDTO, UpdateHorarioDTO } from '../../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.apiUrl, environment.apiKey);
  }

  async getHorarios(): Promise<Horario[]> {
    const { data, error } = await this.supabase
      .from('horario')
      .select('*')
      .order('semana', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getHorario(id: string): Promise<Horario | null> {
    const { data, error } = await this.supabase
      .from('horario')
      .select('*')
      .eq('horarioid', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createHorario(horario: CreateHorarioDTO): Promise<Horario> {
    const { data, error } = await this.supabase
      .from('horario')
      .insert([horario])
      .select()
      .single();

    if (error) {
      console.error('Error creating horario:', error);
      throw error;
    }
    return data;
  }

  async updateHorario(horario: UpdateHorarioDTO): Promise<Horario> {
    const { horarioid, ...updates } = horario;
    
    const { data, error } = await this.supabase
      .from('horario')
      .update(updates)
      .eq('horarioid', horarioid)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteHorario(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('horario')
      .delete()
      .eq('horarioid', id);

    if (error) throw error;
  }
}
