import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <!-- Welcome Card -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <h2 class="text-3xl font-bold mb-2">
          ¡Hola, {{ userProfile()?.nombre }}! 👋
        </h2>
        <p class="text-blue-100">
          Encuentra y reserva tu espacio de estacionamiento de manera rápida y segura
        </p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium">Mis Reservas</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">3</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium">Espacios Disponibles</p>
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
              <p class="text-gray-500 text-sm font-medium">Próxima Reserva</p>
              <p class="text-xl font-bold text-gray-900 mt-2">Hoy, 3:00 PM</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Find Parking -->
        <div class="bg-white rounded-2xl shadow-md p-8">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900">Buscar Estacionamiento</h3>
          </div>
          <p class="text-gray-600 mb-6">
            Encuentra el espacio de estacionamiento perfecto cerca de tu ubicación
          </p>
          <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
            Buscar Ahora
          </button>
        </div>

        <!-- My Reservations -->
        <div class="bg-white rounded-2xl shadow-md p-8">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900">Mis Reservas</h3>
          </div>
          <p class="text-gray-600 mb-6">
            Gestiona tus reservas activas y revisa tu historial
          </p>
          <button class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
            Ver Reservas
          </button>
        </div>
      </div>

      <!-- Recent Reservations -->
      <div class="bg-white rounded-2xl shadow-md p-8">
        <h3 class="text-xl font-bold text-gray-900 mb-6">Reservas Recientes</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-900">Espacio A-23</p>
                <p class="text-sm text-gray-500">Edificio Principal - Piso 2</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-medium text-gray-900">Hoy, 3:00 PM</p>
              <span class="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">Activa</span>
            </div>
          </div>

          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-900">Espacio B-15</p>
                <p class="text-sm text-gray-500">Edificio Norte - Piso 1</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-medium text-gray-900">Ayer, 10:00 AM</p>
              <span class="text-xs text-gray-600 font-medium bg-gray-200 px-2 py-1 rounded-full">Completada</span>
            </div>
          </div>

          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-900">Espacio C-08</p>
                <p class="text-sm text-gray-500">Edificio Sur - Sótano</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-medium text-gray-900">15 Nov, 2:00 PM</p>
              <span class="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">Próxima</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class UserHome {
  private auth = inject(Auth);
  userProfile = this.auth.profile;
}
