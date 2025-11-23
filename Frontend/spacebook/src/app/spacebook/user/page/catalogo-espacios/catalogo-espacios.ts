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
  
  // Carrusel de imágenes institución
  indiceImagenInstitucion = signal(0);
  
  // Carrusel de imágenes por sección
  indicesImagenesSeccion = new Map<string, number>();

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
      this.indiceImagenInstitucion.set(0);
      this.indicesImagenesSeccion.clear();
      
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

  // Métodos para carrusel de institución
  siguienteImagenInstitucion() {
    const inst = this.institucionSeleccionada();
    if (!inst?.imagen_url || inst.imagen_url.length === 0) return;
    
    const indiceActual = this.indiceImagenInstitucion();
    const nuevoIndice = (indiceActual + 1) % inst.imagen_url.length;
    this.indiceImagenInstitucion.set(nuevoIndice);
  }

  anteriorImagenInstitucion() {
    const inst = this.institucionSeleccionada();
    if (!inst?.imagen_url || inst.imagen_url.length === 0) return;
    
    const indiceActual = this.indiceImagenInstitucion();
    const nuevoIndice = indiceActual === 0 ? inst.imagen_url.length - 1 : indiceActual - 1;
    this.indiceImagenInstitucion.set(nuevoIndice);
  }

  irAImagenInstitucion(indice: number) {
    this.indiceImagenInstitucion.set(indice);
  }

  // Métodos para carrusel de secciones
  obtenerIndiceImagenSeccion(seccionId: string): number {
    return this.indicesImagenesSeccion.get(seccionId) || 0;
  }

  siguienteImagenSeccion(seccion: Seccion) {
    if (!seccion.seccion_url || seccion.seccion_url.length === 0) return;
    
    const indiceActual = this.obtenerIndiceImagenSeccion(seccion.seccionid);
    const nuevoIndice = (indiceActual + 1) % seccion.seccion_url.length;
    this.indicesImagenesSeccion.set(seccion.seccionid, nuevoIndice);
  }

  anteriorImagenSeccion(seccion: Seccion) {
    if (!seccion.seccion_url || seccion.seccion_url.length === 0) return;
    
    const indiceActual = this.obtenerIndiceImagenSeccion(seccion.seccionid);
    const nuevoIndice = indiceActual === 0 ? seccion.seccion_url.length - 1 : indiceActual - 1;
    this.indicesImagenesSeccion.set(seccion.seccionid, nuevoIndice);
  }

  irAImagenSeccion(seccionId: string, indice: number) {
    this.indicesImagenesSeccion.set(seccionId, indice);
  }

  // Obtener espacios por sección
  obtenerEspaciosDeSeccion(seccionId: string): Espacio[] {
    return this.espacios().filter(e => e.seccionid === seccionId);
  }

  // Contar espacios disponibles por sección
  contarEspaciosDisponibles(seccionId: string): number {
    return this.obtenerEspaciosDeSeccion(seccionId).filter(e => e.estado === true).length;
  }
}
