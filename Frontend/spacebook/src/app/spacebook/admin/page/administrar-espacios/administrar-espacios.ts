import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../../environments/environment';

interface Institucion {
  institucionid: string;
  nombre: string;
  tipo: string;
  direccion: string;
  servicio: string;
  horarioid?: string;
}

interface Seccion {
  seccionid: string;
  nombre: string;
  tipo: string;
  capacidad: number;
  calificacion: number;
  institucionid: string;
  amenidades: string;
}

interface Espacio {
  espacioid: string;
  nombre: string;
  estado: boolean;
  seccionid: string;
}

interface Horario {
  horarioid: string;
  horainicio: string; // time format
  horafin: string; // time format
  semana: string; // comma-separated days
}

type ModoEdicion = 'crear' | 'editar';
type VistaSecundaria = 'instituciones' | 'secciones' | 'espacios';

@Component({
  selector: 'app-administrar-espacios',
  imports: [CommonModule, FormsModule],
  templateUrl: './administrar-espacios.html',
  styleUrl: './administrar-espacios.css',
  standalone: true
})
export class AdministrarEspacios implements OnInit {
  private supabase: SupabaseClient;
  
  // Pestaña principal
  pestanaActiva = signal<'instituciones' | 'espacios-secciones'>('instituciones');
  
  // Gestión de Instituciones
  instituciones = signal<Institucion[]>([]);
  institucionSeleccionada = signal<Institucion | null>(null);
  mostrarModalInstitucion = signal<boolean>(false);
  modoInstitucion = signal<ModoEdicion>('crear');
  institucionForm = signal<Partial<Institucion>>({
    nombre: '',
    tipo: '',
    direccion: '',
    servicio: '',
    horarioid: undefined
  });
  
  // Gestión de Horarios
  horarios = signal<Horario[]>([]);
  horarioSeleccionado = signal<string | undefined>(undefined);
  
  // Gestión de Espacios y Secciones
  vistaSecundaria = signal<VistaSecundaria>('instituciones');
  secciones = signal<Seccion[]>([]);
  seccionSeleccionada = signal<Seccion | null>(null);
  espacios = signal<Espacio[]>([]);
  
  // Modales y Forms
  mostrarModalSeccion = signal<boolean>(false);
  modoSeccion = signal<ModoEdicion>('crear');
  seccionForm = signal<Partial<Seccion>>({
    nombre: '',
    tipo: '',
    capacidad: 0,
    calificacion: 0,
    amenidades: ''
  });
  
  // Amenidades dinámicas
  amenidadesLista = signal<string[]>(['']); // Inicia con 1 campo vacío
  
  mostrarModalEspacio = signal<boolean>(false);
  modoEspacio = signal<ModoEdicion>('crear');
  espacioForm = signal<Partial<Espacio>>({
    nombre: '',
    estado: true
  });
  
  // Estados generales
  cargando = signal<boolean>(false);
  error = signal<string>('');
  mensajeExito = signal<string>('');

  constructor() {
    this.supabase = createClient(environment.apiUrl, environment.apiKey);
  }

  ngOnInit() {
    this.cargarInstituciones();
    this.cargarHorarios();
  }

  // ==================== CARGAR HORARIOS ====================
  async cargarHorarios() {
    try {
      const { data, error } = await this.supabase
        .from('horario')
        .select('*')
        .order('horainicio', { ascending: true });

      if (error) throw error;

      this.horarios.set(data || []);
    } catch (error: any) {
      console.error('Error al cargar horarios:', error);
    }
  }

  obtenerTextoHorario(horario: Horario): string {
    const dias = horario.semana || 'Sin días especificados';
    const inicio = horario.horainicio?.substring(0, 5) || '--:--';
    const fin = horario.horafin?.substring(0, 5) || '--:--';
    return `⏰ ${inicio} - ${fin} | 📅 ${dias}`;
  }

  // ==================== PESTAÑA PRINCIPAL ====================
  cambiarPestana(pestana: 'instituciones' | 'espacios-secciones') {
    this.pestanaActiva.set(pestana);
    this.limpiarMensajes();
  }

  // ==================== GESTIÓN DE INSTITUCIONES ====================
  async cargarInstituciones() {
    try {
      this.cargando.set(true);
      this.error.set('');
      
      const { data, error } = await this.supabase
        .from('institucion')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) throw error;
      
      this.instituciones.set(data || []);
    } catch (error: any) {
      this.error.set('Error al cargar las instituciones');
      console.error('Error:', error);
    } finally {
      this.cargando.set(false);
    }
  }

  abrirModalInstitucion(modo: ModoEdicion, institucion?: Institucion) {
    this.modoInstitucion.set(modo);
    if (modo === 'editar' && institucion) {
      this.institucionForm.set({ ...institucion });
      this.horarioSeleccionado.set(institucion.horarioid);
      this.institucionSeleccionada.set(institucion);
    } else {
      this.institucionForm.set({
        nombre: '',
        tipo: '',
        direccion: '',
        servicio: '',
        horarioid: undefined
      });
      this.horarioSeleccionado.set(undefined);
      this.institucionSeleccionada.set(null);
    }
    this.mostrarModalInstitucion.set(true);
    this.limpiarMensajes();
  }

  cerrarModalInstitucion() {
    this.mostrarModalInstitucion.set(false);
    this.institucionForm.set({
      nombre: '',
      tipo: '',
      direccion: '',
      servicio: '',
      horarioid: undefined
    });
    this.horarioSeleccionado.set(undefined);
    this.institucionSeleccionada.set(null);
  }

  async guardarInstitucion() {
    const form = this.institucionForm();
    
    if (!form.nombre?.trim()) {
      this.error.set('El nombre de la institución es requerido');
      return;
    }

    try {
      this.cargando.set(true);
      this.error.set('');

      const horarioId = this.horarioSeleccionado() || null;

      if (this.modoInstitucion() === 'crear') {
        const { error } = await this.supabase
          .from('institucion')
          .insert([{
            nombre: form.nombre,
            tipo: form.tipo || null,
            direccion: form.direccion || null,
            servicio: form.servicio || null,
            horarioid: horarioId
          }]);

        if (error) throw error;
        this.mensajeExito.set('Institución creada exitosamente');
      } else {
        const institucion = this.institucionSeleccionada();
        if (!institucion) return;

        const { error } = await this.supabase
          .from('institucion')
          .update({
            nombre: form.nombre,
            tipo: form.tipo || null,
            direccion: form.direccion || null,
            servicio: form.servicio || null,
            horarioid: horarioId
          })
          .eq('institucionid', institucion.institucionid);

        if (error) throw error;
        this.mensajeExito.set('Institución actualizada exitosamente');
      }

      await this.cargarInstituciones();
      
      setTimeout(() => {
        this.cerrarModalInstitucion();
        this.mensajeExito.set('');
      }, 1500);

    } catch (error: any) {
      this.error.set('Error al guardar la institución');
      console.error('Error:', error);
    } finally {
      this.cargando.set(false);
    }
  }

  async eliminarInstitucion(institucion: Institucion) {
    if (!confirm(`¿Estás seguro de que deseas eliminar la institución "${institucion.nombre}"? Esto también eliminará todas sus secciones y espacios asociados.`)) {
      return;
    }

    try {
      this.cargando.set(true);
      this.error.set('');

      const { error } = await this.supabase
        .from('institucion')
        .delete()
        .eq('institucionid', institucion.institucionid);

      if (error) throw error;

      this.mensajeExito.set('Institución eliminada exitosamente');
      await this.cargarInstituciones();

      setTimeout(() => {
        this.mensajeExito.set('');
      }, 3000);

    } catch (error: any) {
      this.error.set('Error al eliminar la institución');
      console.error('Error:', error);
    } finally {
      this.cargando.set(false);
    }
  }

  // ==================== GESTIÓN DE SECCIONES ====================
  async seleccionarInstitucionParaSecciones(institucion: Institucion) {
    this.institucionSeleccionada.set(institucion);
    this.vistaSecundaria.set('secciones');
    await this.cargarSecciones(institucion);
  }

  async cargarSecciones(institucion: Institucion) {
    try {
      this.cargando.set(true);
      this.error.set('');
      
      const { data, error } = await this.supabase
        .from('seccion')
        .select('*')
        .eq('institucionid', institucion.institucionid)
        .order('nombre', { ascending: true });

      if (error) throw error;
      
      this.secciones.set(data || []);
    } catch (error: any) {
      this.error.set('Error al cargar las secciones');
      console.error('Error:', error);
    } finally {
      this.cargando.set(false);
    }
  }

  abrirModalSeccion(modo: ModoEdicion, seccion?: Seccion) {
    this.modoSeccion.set(modo);
    if (modo === 'editar' && seccion) {
      this.seccionForm.set({ ...seccion });
      this.seccionSeleccionada.set(seccion);
      // Cargar amenidades desde el string separado por comas
      if (seccion.amenidades) {
        const amenidadesArray = seccion.amenidades.split(',').map(a => a.trim()).filter(a => a !== '');
        // Si no hay amenidades, iniciar con 1 campo vacío
        if (amenidadesArray.length === 0) {
          amenidadesArray.push('');
        }
        this.amenidadesLista.set(amenidadesArray);
      } else {
        this.amenidadesLista.set(['']);
      }
    } else {
      this.seccionForm.set({
        nombre: '',
        tipo: '',
        capacidad: 0,
        calificacion: 0,
        amenidades: ''
      });
      this.amenidadesLista.set(['']);
      this.seccionSeleccionada.set(null);
    }
    this.mostrarModalSeccion.set(true);
    this.limpiarMensajes();
  }

  cerrarModalSeccion() {
    this.mostrarModalSeccion.set(false);
    this.seccionForm.set({
      nombre: '',
      tipo: '',
      capacidad: 0,
      calificacion: 0,
      amenidades: ''
    });
    this.amenidadesLista.set(['']);
    this.seccionSeleccionada.set(null);
  }

  async guardarSeccion() {
    const form = this.seccionForm();
    const institucion = this.institucionSeleccionada();
    
    if (!form.nombre?.trim()) {
      this.error.set('El nombre de la sección es requerido');
      return;
    }

    if (!institucion) {
      this.error.set('No hay una institución seleccionada');
      return;
    }

    // Convertir amenidades array a string separado por comas
    const amenidadesString = this.amenidadesLista()
      .filter(a => a.trim() !== '')
      .join(',');

    try {
      this.cargando.set(true);
      this.error.set('');

      if (this.modoSeccion() === 'crear') {
        // Crear la sección
        const { data: nuevaSeccion, error: errorSeccion } = await this.supabase
          .from('seccion')
          .insert([{
            nombre: form.nombre,
            tipo: form.tipo || null,
            capacidad: form.capacidad || 0,
            calificacion: form.calificacion || 0,
            amenidades: amenidadesString || null,
            institucionid: institucion.institucionid
          }])
          .select()
          .single();

        if (errorSeccion) throw errorSeccion;

        // Crear espacios automáticamente según la capacidad
        const capacidad = form.capacidad || 0;
        if (capacidad > 0 && nuevaSeccion) {
          const espacios = [];
          for (let i = 1; i <= capacidad; i++) {
            espacios.push({
              nombre: `${form.nombre}-${i.toString().padStart(2, '0')}`,
              estado: true,
              seccionid: nuevaSeccion.seccionid
            });
          }

          const { error: errorEspacios } = await this.supabase
            .from('espacio')
            .insert(espacios);

          if (errorEspacios) {
            console.error('Error al crear espacios:', errorEspacios);
            this.mensajeExito.set(`Sección creada exitosamente, pero hubo un error al crear ${capacidad} espacios`);
          } else {
            this.mensajeExito.set(`Sección creada exitosamente con ${capacidad} espacios`);
          }
        } else {
          this.mensajeExito.set('Sección creada exitosamente');
        }
      } else {
        const seccion = this.seccionSeleccionada();
        if (!seccion) return;

        const capacidadAnterior = seccion.capacidad;
        const capacidadNueva = form.capacidad || 0;

        // Actualizar la sección
        const { error } = await this.supabase
          .from('seccion')
          .update({
            nombre: form.nombre,
            tipo: form.tipo || null,
            capacidad: capacidadNueva,
            calificacion: form.calificacion || 0,
            amenidades: amenidadesString || null
          })
          .eq('seccionid', seccion.seccionid);

        if (error) throw error;

        // Si aumentó la capacidad, crear los espacios faltantes
        if (capacidadNueva > capacidadAnterior) {
          const espaciosFaltantes = [];
          for (let i = capacidadAnterior + 1; i <= capacidadNueva; i++) {
            espaciosFaltantes.push({
              nombre: `${form.nombre}-${i.toString().padStart(2, '0')}`,
              estado: true,
              seccionid: seccion.seccionid
            });
          }

          const { error: errorEspacios } = await this.supabase
            .from('espacio')
            .insert(espaciosFaltantes);

          if (errorEspacios) {
            console.error('Error al crear espacios adicionales:', errorEspacios);
            this.mensajeExito.set('Sección actualizada, pero hubo un error al crear espacios adicionales');
          } else {
            this.mensajeExito.set(`Sección actualizada y se agregaron ${capacidadNueva - capacidadAnterior} espacios nuevos`);
          }
        } else {
          this.mensajeExito.set('Sección actualizada exitosamente');
        }
      }

      await this.cargarSecciones(institucion);
      
      setTimeout(() => {
        this.cerrarModalSeccion();
        this.mensajeExito.set('');
      }, 1500);

    } catch (error: any) {
      this.error.set('Error al guardar la sección');
      console.error('Error:', error);
    } finally {
      this.cargando.set(false);
    }
  }

  async eliminarSeccion(seccion: Seccion) {
    if (!confirm(`¿Estás seguro de que deseas eliminar la sección "${seccion.nombre}"? Esto también eliminará todos sus espacios asociados.`)) {
      return;
    }

    try {
      this.cargando.set(true);
      this.error.set('');

      const { error } = await this.supabase
        .from('seccion')
        .delete()
        .eq('seccionid', seccion.seccionid);

      if (error) throw error;

      this.mensajeExito.set('Sección eliminada exitosamente');
      
      const institucion = this.institucionSeleccionada();
      if (institucion) {
        await this.cargarSecciones(institucion);
      }

      setTimeout(() => {
        this.mensajeExito.set('');
      }, 3000);

    } catch (error: any) {
      this.error.set('Error al eliminar la sección');
      console.error('Error:', error);
    } finally {
      this.cargando.set(false);
    }
  }

  // ==================== GESTIÓN DE ESPACIOS ====================
  async seleccionarSeccionParaEspacios(seccion: Seccion) {
    this.seccionSeleccionada.set(seccion);
    this.vistaSecundaria.set('espacios');
    await this.cargarEspacios(seccion);
  }

  async cargarEspacios(seccion: Seccion) {
    try {
      this.cargando.set(true);
      this.error.set('');
      
      const { data, error } = await this.supabase
        .from('espacio')
        .select('*')
        .eq('seccionid', seccion.seccionid)
        .order('nombre', { ascending: true });

      if (error) throw error;
      
      this.espacios.set(data || []);
    } catch (error: any) {
      this.error.set('Error al cargar los espacios');
      console.error('Error:', error);
    } finally {
      this.cargando.set(false);
    }
  }

  abrirModalEspacio(modo: ModoEdicion, espacio?: Espacio) {
    this.modoEspacio.set(modo);
    if (modo === 'editar' && espacio) {
      this.espacioForm.set({ ...espacio });
    } else {
      this.espacioForm.set({
        nombre: '',
        estado: true
      });
    }
    this.mostrarModalEspacio.set(true);
    this.limpiarMensajes();
  }

  cerrarModalEspacio() {
    this.mostrarModalEspacio.set(false);
    this.espacioForm.set({
      nombre: '',
      estado: true
    });
  }

  async guardarEspacio() {
    const form = this.espacioForm();
    const seccion = this.seccionSeleccionada();
    
    if (!form.nombre?.trim()) {
      this.error.set('El nombre del espacio es requerido');
      return;
    }

    if (!seccion) {
      this.error.set('No hay una sección seleccionada');
      return;
    }

    try {
      this.cargando.set(true);
      this.error.set('');

      if (this.modoEspacio() === 'crear') {
        const { error } = await this.supabase
          .from('espacio')
          .insert([{
            nombre: form.nombre,
            estado: form.estado ?? true,
            seccionid: seccion.seccionid
          }]);

        if (error) throw error;
        this.mensajeExito.set('Espacio creado exitosamente');
      } else {
        if (!form.espacioid) return;

        const { error } = await this.supabase
          .from('espacio')
          .update({
            nombre: form.nombre,
            estado: form.estado ?? true
          })
          .eq('espacioid', form.espacioid);

        if (error) throw error;
        this.mensajeExito.set('Espacio actualizado exitosamente');
      }

      await this.cargarEspacios(seccion);
      
      setTimeout(() => {
        this.cerrarModalEspacio();
        this.mensajeExito.set('');
      }, 1500);

    } catch (error: any) {
      this.error.set('Error al guardar el espacio');
      console.error('Error:', error);
    } finally {
      this.cargando.set(false);
    }
  }

  async eliminarEspacio(espacio: Espacio) {
    if (!confirm(`¿Estás seguro de que deseas eliminar el espacio "${espacio.nombre}"?`)) {
      return;
    }

    try {
      this.cargando.set(true);
      this.error.set('');

      const { error } = await this.supabase
        .from('espacio')
        .delete()
        .eq('espacioid', espacio.espacioid);

      if (error) throw error;

      this.mensajeExito.set('Espacio eliminado exitosamente');
      
      const seccion = this.seccionSeleccionada();
      if (seccion) {
        await this.cargarEspacios(seccion);
      }

      setTimeout(() => {
        this.mensajeExito.set('');
      }, 3000);

    } catch (error: any) {
      this.error.set('Error al eliminar el espacio');
      console.error('Error:', error);
    } finally {
      this.cargando.set(false);
    }
  }

  // ==================== NAVEGACIÓN ====================
  volverAInstitucionesSecundaria() {
    this.vistaSecundaria.set('instituciones');
    this.institucionSeleccionada.set(null);
    this.seccionSeleccionada.set(null);
    this.secciones.set([]);
    this.espacios.set([]);
    this.limpiarMensajes();
  }

  async volverASecciones() {
    this.vistaSecundaria.set('secciones');
    this.seccionSeleccionada.set(null);
    this.espacios.set([]);
    this.limpiarMensajes();
    
    // Recargar las secciones de la institución actual
    const institucion = this.institucionSeleccionada();
    if (institucion) {
      await this.cargarSecciones(institucion);
    }
  }

  // ==================== UTILIDADES ====================
  obtenerEstadoTexto(estado: boolean): string {
    return estado ? 'Desocupado' : 'Ocupado';
  }

  obtenerEstadoClase(estado: boolean): string {
    return estado ? 'estado-desocupado' : 'estado-ocupado';
  }

  // Métodos auxiliares para actualizar formularios (evitar spread operator en template)
  actualizarInstitucionNombre(value: string) {
    this.institucionForm.set({ ...this.institucionForm(), nombre: value });
  }

  actualizarInstitucionTipo(value: string) {
    this.institucionForm.set({ ...this.institucionForm(), tipo: value });
  }

  actualizarInstitucionDireccion(value: string) {
    this.institucionForm.set({ ...this.institucionForm(), direccion: value });
  }

  actualizarInstitucionServicio(value: string) {
    this.institucionForm.set({ ...this.institucionForm(), servicio: value });
  }

  actualizarHorarioSeleccionado(horarioid: string) {
    this.horarioSeleccionado.set(horarioid);
    this.institucionForm.set({ ...this.institucionForm(), horarioid: horarioid });
  }

  actualizarSeccionNombre(value: string) {
    this.seccionForm.set({ ...this.seccionForm(), nombre: value });
  }

  actualizarSeccionTipo(value: string) {
    this.seccionForm.set({ ...this.seccionForm(), tipo: value });
  }

  actualizarSeccionCapacidad(value: number) {
    this.seccionForm.set({ ...this.seccionForm(), capacidad: value });
  }

  actualizarSeccionCalificacion(value: number) {
    this.seccionForm.set({ ...this.seccionForm(), calificacion: value });
  }

  // ==================== GESTIÓN DE AMENIDADES ====================
  actualizarAmenidad(index: number, value: string) {
    const amenidades = [...this.amenidadesLista()];
    amenidades[index] = value;
    this.amenidadesLista.set(amenidades);
  }

  agregarCampoAmenidad() {
    const amenidades = [...this.amenidadesLista()];
    if (amenidades.length < 10) {
      amenidades.push('');
      this.amenidadesLista.set(amenidades);
    }
  }

  eliminarCampoAmenidad(index: number) {
    const amenidades = [...this.amenidadesLista()];
    // Solo permitir eliminar si hay más de 1 campo
    if (amenidades.length > 1) {
      amenidades.splice(index, 1);
      this.amenidadesLista.set(amenidades);
    }
  }

  puedeAgregarAmenidad(): boolean {
    return this.amenidadesLista().length < 10;
  }

  puedeEliminarAmenidad(): boolean {
    return this.amenidadesLista().length > 1;
  }

  actualizarEspacioNombre(value: string) {
    this.espacioForm.set({ ...this.espacioForm(), nombre: value });
  }

  actualizarEspacioEstado(value: boolean) {
    this.espacioForm.set({ ...this.espacioForm(), estado: value });
  }

  limpiarMensajes() {
    this.error.set('');
    this.mensajeExito.set('');
  }
}
