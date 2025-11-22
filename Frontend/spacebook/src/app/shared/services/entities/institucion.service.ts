import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';
import { Institucion, CreateInstitucionDTO, UpdateInstitucionDTO } from '../../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class InstitucionService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.apiUrl, environment.apiKey);
  }

  async getInstituciones(): Promise<Institucion[]> {
    const { data, error } = await this.supabase
      .from('institucion')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getInstitucion(id: string): Promise<Institucion | null> {
    const { data, error } = await this.supabase
      .from('institucion')
      .select('*')
      .eq('institucionid', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createInstitucion(institucion: CreateInstitucionDTO): Promise<Institucion> {
    const institucionData: any = {
      nombre: institucion.nombre,
      tipo: institucion.tipo,
      direccion: institucion.direccion,
      servicio: institucion.servicio,
      imagenUrl: institucion.imagenUrl ? [institucion.imagenUrl] : []
    };
    
    if (institucion.horarioid) {
      institucionData.horarioid = institucion.horarioid;
    }

    const { data, error } = await this.supabase
      .from('institucion')
      .insert([institucionData])
      .select()
      .single();

    if (error) {
      console.error('Error creating institucion:', error);
      throw error;
    }
    return data;
  }

  async updateInstitucion(institucion: UpdateInstitucionDTO): Promise<Institucion> {
    const { institucionid, ...updates } = institucion;
    
    const updateData: any = {
      nombre: updates.nombre,
      tipo: updates.tipo,
      direccion: updates.direccion,
      servicio: updates.servicio,
      imagenUrl: updates.imagenUrl ? [updates.imagenUrl] : []
    };
    
    if (updates.horarioid !== undefined) {
      updateData.horarioid = updates.horarioid;
    }
    
    const { data, error } = await this.supabase
      .from('institucion')
      .update(updateData)
      .eq('institucionid', institucionid)
      .select()
      .single();

    if (error) {
      console.error('Error updating institucion:', error);
      throw error;
    }
    return data;
  }

  async deleteInstitucion(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('institucion')
      .delete()
      .eq('institucionid', id);

    if (error) throw error;
  }
}
