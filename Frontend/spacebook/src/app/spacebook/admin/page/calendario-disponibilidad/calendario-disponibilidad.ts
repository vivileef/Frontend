import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../../environments/environment';

interface Institucion {
  institucionid: string;
  nombre: string;
  horarioid?: string;
}

interface Horario {
  horarioid: string;
  horainicio: string; // formato "HH:MM"
  horafin: string; // formato "HH:MM"
  semana: string; // "Lunes,Martes,Miercoles..." días separados por coma
}

interface DiaCalendario {
  dia: number;
  mes: number;
  año: number;
  esMesActual: boolean;
  fecha: Date;
}

@Component({
  selector: 'app-calendario-disponibilidad',
  imports: [CommonModule, FormsModule],
  templateUrl: './calendario-disponibilidad.html',
  styleUrl: './calendario-disponibilidad.css',
  standalone: true
})
export class CalendarioDisponibilidad implements OnInit {
  private supabase: SupabaseClient;
  
  // Estado general
  instituciones = signal<Institucion[]>([]);
  institucionSeleccionada = signal<Institucion | null>(null);
  horarioActual = signal<Horario | null>(null);
  
  // Calendario
  fechaActual = signal<Date>(new Date());
  diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  diasCompletos = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  
  // Modal de edición
  mostrarModalHorario = signal<boolean>(false);
  horarioForm = signal<{
    horainicio: string;
    horafin: string;
    diasSeleccionados: string[];
  }>({
    horainicio: '08:00',
    horafin: '18:00',
    diasSeleccionados: []
  });
  
  // Estados
  cargando = signal<boolean>(false);
  error = signal<string>('');
  mensajeExito = signal<string>('');
  
  // Computed
  diasCalendario = computed(() => {
    const fecha = this.fechaActual();
    const año = fecha.getFullYear();
    const mes = fecha.getMonth();
    
    // Primer día del mes
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    
    // Días a mostrar antes del primer día
    const diasAntes = primerDia.getDay();
    
    // Días a mostrar después del último día
    const diasDespues = 6 - ultimoDia.getDay();
    
    const dias: DiaCalendario[] = [];
    
    // Días del mes anterior
    const mesAnterior = new Date(año, mes, 0);
    for (let i = diasAntes - 1; i >= 0; i--) {
      const dia = mesAnterior.getDate() - i;
      dias.push({
        dia,
        mes: mes - 1,
        año: mes === 0 ? año - 1 : año,
        esMesActual: false,
        fecha: new Date(año, mes - 1, dia)
      });
    }
    
    // Días del mes actual
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      dias.push({
        dia,
        mes,
        año,
        esMesActual: true,
        fecha: new Date(año, mes, dia)
      });
    }
    
    // Días del mes siguiente
    for (let i = 1; i <= diasDespues; i++) {
      dias.push({
        dia: i,
        mes: mes + 1,
        año: mes === 11 ? año + 1 : año,
        esMesActual: false,
        fecha: new Date(año, mes + 1, i)
      });
    }
    
    return dias;
  });
  
  mesActualTexto = computed(() => {
    const fecha = this.fechaActual();
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
  });
  
  diasLaboralesArray = computed(() => {
    const horario = this.horarioActual();
    if (!horario || !horario.semana) return [];
    return horario.semana.split(',').map(d => d.trim());
  });

  constructor() {
    this.supabase = createClient(environment.apiUrl, environment.apiKey);
  }

  ngOnInit() {
    this.cargarInstituciones();
  }

  // ==================== CARGA DE DATOS ====================
  async cargarInstituciones() {
    try {
      this.cargando.set(true);
      this.error.set('');
      
      const { data, error } = await this.supabase
        .from('institucion')
        .select('institucionid, nombre, horarioid')
        .order('nombre', { ascending: true});

      if (error) throw error;
      
      this.instituciones.set(data || []);
    } catch (error: any) {
      this.error.set('Error al cargar las instituciones');
      console.error('Error:', error);
    } finally {
      this.cargando.set(false);
    }
  }

  async seleccionarInstitucion(institucion: Institucion) {
    this.institucionSeleccionada.set(institucion);
    
    if (institucion.horarioid) {
      await this.cargarHorario(institucion.horarioid);
    } else {
      this.horarioActual.set(null);
    }
  }

  async cargarHorario(horarioid: string) {
    try {
      this.cargando.set(true);
      
      const { data, error } = await this.supabase
        .from('horario')
        .select('*')
        .eq('horarioid', horarioid)
        .single();

      if (error) throw error;
      
      this.horarioActual.set(data);
    } catch (error: any) {
      this.error.set('Error al cargar el horario');
      console.error('Error:', error);
    } finally {
      this.cargando.set(false);
    }
  }

  // ==================== NAVEGACIÓN CALENDARIO ====================
  mesAnterior() {
    const fecha = this.fechaActual();
    this.fechaActual.set(new Date(fecha.getFullYear(), fecha.getMonth() - 1, 1));
  }

  mesSiguiente() {
    const fecha = this.fechaActual();
    this.fechaActual.set(new Date(fecha.getFullYear(), fecha.getMonth() + 1, 1));
  }

  irAHoy() {
    this.fechaActual.set(new Date());
  }

  // ==================== GESTIÓN DE HORARIOS ====================
  abrirModalHorario() {
    const horario = this.horarioActual();
    
    if (horario) {
      this.horarioForm.set({
        horainicio: horario.horainicio || '08:00',
        horafin: horario.horafin || '18:00',
        diasSeleccionados: horario.semana ? horario.semana.split(',').map(d => d.trim()) : []
      });
    } else {
      this.horarioForm.set({
        horainicio: '08:00',
        horafin: '18:00',
        diasSeleccionados: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
      });
    }
    
    this.mostrarModalHorario.set(true);
    this.limpiarMensajes();
  }

  cerrarModalHorario() {
    this.mostrarModalHorario.set(false);
  }

  toggleDia(dia: string) {
    const form = this.horarioForm();
    const diasActuales = [...form.diasSeleccionados];
    
    const index = diasActuales.indexOf(dia);
    if (index > -1) {
      diasActuales.splice(index, 1);
    } else {
      diasActuales.push(dia);
    }
    
    this.horarioForm.set({
      ...form,
      diasSeleccionados: diasActuales
    });
  }

  isDiaSeleccionado(dia: string): boolean {
    return this.horarioForm().diasSeleccionados.includes(dia);
  }

  async guardarHorario() {
    const form = this.horarioForm();
    const institucion = this.institucionSeleccionada();
    
    if (!institucion) {
      this.error.set('No hay una institución seleccionada');
      return;
    }
    
    if (form.diasSeleccionados.length === 0) {
      this.error.set('Debe seleccionar al menos un día');
      return;
    }
    
    if (!form.horainicio || !form.horafin) {
      this.error.set('Debe especificar hora de inicio y fin');
      return;
    }

    try {
      this.cargando.set(true);
      this.error.set('');
      
      const semanaTexto = form.diasSeleccionados.join(',');
      
      if (institucion.horarioid) {
        // Actualizar horario existente
        const { error } = await this.supabase
          .from('horario')
          .update({
            horainicio: form.horainicio,
            horafin: form.horafin,
            semana: semanaTexto
          })
          .eq('horarioid', institucion.horarioid);

        if (error) throw error;
        
        await this.cargarHorario(institucion.horarioid);
      } else {
        // Crear nuevo horario
        const { data: nuevoHorario, error: errorHorario } = await this.supabase
          .from('horario')
          .insert([{
            horainicio: form.horainicio,
            horafin: form.horafin,
            semana: semanaTexto
          }])
          .select()
          .single();

        if (errorHorario) throw errorHorario;

        // Actualizar institución con el nuevo horarioid
        const { error: errorInstitucion } = await this.supabase
          .from('institucion')
          .update({ horarioid: nuevoHorario.horarioid })
          .eq('institucionid', institucion.institucionid);

        if (errorInstitucion) throw errorInstitucion;

        // Actualizar estado local
        this.institucionSeleccionada.set({
          ...institucion,
          horarioid: nuevoHorario.horarioid
        });
        
        this.horarioActual.set(nuevoHorario);
        await this.cargarInstituciones();
      }

      this.mensajeExito.set('Horario guardado exitosamente');
      
      setTimeout(() => {
        this.cerrarModalHorario();
        this.mensajeExito.set('');
      }, 1500);

    } catch (error: any) {
      this.error.set('Error al guardar el horario');
      console.error('Error:', error);
    } finally {
      this.cargando.set(false);
    }
  }

  // ==================== UTILIDADES ====================
  esDiaLaboral(fecha: Date): boolean {
    const horario = this.horarioActual();
    if (!horario || !horario.semana) return false;
    
    const nombreDia = this.diasCompletos[fecha.getDay()];
    return this.diasLaboralesArray().includes(nombreDia);
  }

  actualizarHoraInicio(value: string) {
    const form = this.horarioForm();
    this.horarioForm.set({
      ...form,
      horainicio: value
    });
  }

  actualizarHoraFin(value: string) {
    const form = this.horarioForm();
    this.horarioForm.set({
      ...form,
      horafin: value
    });
  }

  limpiarMensajes() {
    this.error.set('');
    this.mensajeExito.set('');
  }

  formatearHora(hora: string): string {
    if (!hora) return '';
    return hora.substring(0, 5); // Solo HH:MM
  }
}
