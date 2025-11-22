import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../../../shared/services/database.service';
import { Institucion, Seccion, Espacio } from '../../../../shared/models/database.models';

@Component({
  selector: 'app-catalogo-espacios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo-espacios.html',
  styleUrl: './catalogo-espacios.css',
})
export class CatalogoEspacios implements OnInit {
  // Signals para datos
  instituciones = signal<Institucion[]>([]);
  secciones = signal<Seccion[]>([]);
  espacios = signal<Espacio[]>([]);
  
  // Navegación
  vistaActual = signal<'instituciones' | 'espacios'>('instituciones');
  institucionSeleccionada = signal<Institucion | null>(null);
  
  // Estados
  cargando = signal(true);
  error = signal('');

  private dbService = inject(DatabaseService);

  async ngOnInit() {
    await this.cargarInstituciones();
  }

  async cargarInstituciones() {
    try {
      this.cargando.set(true);
      this.error.set('');
      const data = await this.dbService.getInstituciones();
      this.instituciones.set(data);
    } catch (err: any) {
      this.error.set('Error al cargar instituciones: ' + err.message);
      console.error(err);
    } finally {
      this.cargando.set(false);
    }
  }

  async seleccionarInstitucion(institucion: Institucion) {
    try {
      this.cargando.set(true);
      this.error.set('');
      this.institucionSeleccionada.set(institucion);
      
      // Cargar secciones de la institución
      const secciones = await this.dbService.getSecciones(institucion.institucionid);
      this.secciones.set(secciones);
      
      // Cargar espacios de todas las secciones
      const todosEspacios: Espacio[] = [];
      for (const seccion of secciones) {
        const espaciosSeccion = await this.dbService.getEspacios(seccion.seccionid);
        todosEspacios.push(...espaciosSeccion);
      }
      this.espacios.set(todosEspacios);
      
      this.vistaActual.set('espacios');
    } catch (err: any) {
      this.error.set('Error al cargar espacios: ' + err.message);
      console.error(err);
    } finally {
      this.cargando.set(false);
    }
  }

  volverAInstituciones() {
    this.vistaActual.set('instituciones');
    this.institucionSeleccionada.set(null);
    this.secciones.set([]);
    this.espacios.set([]);
  }

  reservarEspacio(espacio: Espacio) {
    // TODO: Implementar lógica de reserva
    alert(`Función de reserva próximamente disponible para: ${espacio.nombre}`);
  }

  obtenerEstadoTexto(estado?: boolean): string {
    return estado === true ? 'Disponible' : estado === false ? 'Ocupado' : 'Sin definir';
  }

  obtenerEstadoClase(estado?: boolean): string {
    return estado === true ? 'bg-green-100 text-green-800' : estado === false ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800';
  }
}
