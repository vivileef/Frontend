import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';
import { Incidencia, CreateIncidenciaDTO, UpdateIncidenciaDTO } from '../../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.apiUrl, environment.apiKey);
  }

  async getIncidencias(usuarioId?: string): Promise<Incidencia[]> {
    let query = this.supabase.from('incidencia').select('*');
    
    if (usuarioId) {
      query = query.eq('usuarioid', usuarioId);
    }
    
    query = query.order('fechaIncidencia', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async getIncidencia(id: string): Promise<Incidencia | null> {
    const { data, error } = await this.supabase
      .from('incidencia')
      .select('*')
      .eq('incidenciaid', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createIncidencia(incidencia: CreateIncidenciaDTO): Promise<Incidencia> {
    const { data, error } = await this.supabase
      .from('incidencia')
      .insert([incidencia])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateIncidencia(incidencia: UpdateIncidenciaDTO): Promise<Incidencia> {
    const { incidenciaid, ...updates } = incidencia;
    
    const { data, error } = await this.supabase
      .from('incidencia')
      .update(updates)
      .eq('incidenciaid', incidenciaid)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteIncidencia(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('incidencia')
      .delete()
      .eq('incidenciaid', id);

    if (error) throw error;
  }
}
