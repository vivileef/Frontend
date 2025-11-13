import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <!-- Welcome Card -->
      <div class="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <h2 class="text-3xl font-bold mb-2">
          ¡Bienvenido, {{ userProfile()?.nombre }}! 👋
        </h2>
        <p class="text-red-100">
          Panel de administración de SpaceBook - Gestiona espacios y reservas
        </p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium">Total Espacios</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">156</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium">Disponibles</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">42</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium">Ocupados</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">98</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium">Reservas Hoy</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">16</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Nuevo Espacio</h3>
              <p class="text-sm text-gray-500">Agregar espacio</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Ver Calendario</h3>
              <p class="text-sm text-gray-500">Disponibilidad</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Reportes</h3>
              <p class="text-sm text-gray-500">Ver estadísticas</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Actividad Reciente</h3>
        <div class="space-y-4">
          <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">Nueva reserva confirmada</p>
              <p class="text-xs text-gray-500">Espacio A-23 reservado por Juan Pérez</p>
              <p class="text-xs text-gray-400 mt-1">Hace 5 minutos</p>
            </div>
          </div>

          <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">Nuevo espacio agregado</p>
              <p class="text-xs text-gray-500">Espacio B-45 en Edificio Norte</p>
              <p class="text-xs text-gray-400 mt-1">Hace 1 hora</p>
            </div>
          </div>

          <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">Reserva próxima a vencer</p>
              <p class="text-xs text-gray-500">Espacio C-12 vence en 30 minutos</p>
              <p class="text-xs text-gray-400 mt-1">Hace 2 horas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminHome {
  private auth = inject(Auth);
  userProfile = this.auth.profile;
}
