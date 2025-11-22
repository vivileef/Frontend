import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../../../shared/services/database.service';
import { Auth } from '../../../../shared/services/auth.service';
import { Notificacion } from '../../../../shared/models/database.models';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificaciones.html'
})
export class NotificacionesComponent implements OnInit {
  notificaciones = signal<Notificacion[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  constructor(
    private dbService: DatabaseService,
    private auth: Auth
  ) {}

  async ngOnInit() {
    await this.cargarNotificaciones();
  }

  async cargarNotificaciones() {
    try {
      this.cargando.set(true);
      this.error.set(null);

      const usuarioId = this.auth.profile()?.usuarioid;
      if (!usuarioId) {
        this.error.set('No se encontró el usuario');
        return;
      }

      const notificaciones = await this.dbService.getNotificaciones(usuarioId);
      this.notificaciones.set(notificaciones);
    } catch (err: any) {
      console.error('Error al cargar notificaciones:', err);
      this.error.set('Error al cargar las notificaciones');
    } finally {
      this.cargando.set(false);
    }
  }

  async eliminarNotificacion(notificacionId: string) {
    try {
      await this.dbService.deleteNotificacion(notificacionId);
      await this.cargarNotificaciones();
    } catch (err: any) {
      console.error('Error al eliminar notificación:', err);
      alert('Error al eliminar la notificación');
    }
  }

  async marcarTodasComoLeidas() {
    try {
      const usuarioId = this.auth.profile()?.usuarioid;
      if (!usuarioId) return;

      await this.dbService.marcarNotificacionesComoLeidas(usuarioId);
      await this.cargarNotificaciones();
    } catch (err: any) {
      console.error('Error al marcar notificaciones:', err);
      alert('Error al marcar las notificaciones como leídas');
    }
  }

  formatearFecha(fecha: string): string {
    const now = new Date();
    const fechaNotif = new Date(fecha);
    const diffMs = now.getTime() - fechaNotif.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return fechaNotif.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  obtenerIcono(descripcion?: string): string {
    if (!descripcion) return '📬';
    
    const desc = descripcion.toLowerCase();
    if (desc.includes('reserva')) return '📅';
    if (desc.includes('cancelada')) return '❌';
    if (desc.includes('confirmada')) return '✅';
    if (desc.includes('incidencia')) return '⚠️';
    if (desc.includes('comentario')) return '💬';
    return '📬';
  }

  obtenerColorBorde(descripcion?: string): string {
    if (!descripcion) return 'border-l-blue-500';
    
    const desc = descripcion.toLowerCase();
    if (desc.includes('cancelada')) return 'border-l-red-500';
    if (desc.includes('confirmada')) return 'border-l-green-500';
    if (desc.includes('incidencia')) return 'border-l-yellow-500';
    return 'border-l-blue-500';
  }
}
