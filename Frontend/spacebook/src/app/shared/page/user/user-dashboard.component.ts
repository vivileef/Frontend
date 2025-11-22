import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-50 flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-lg">
        <div class="p-6">
          <div class="flex items-center space-x-3 mb-8">
            <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-lg font-bold text-gray-900">SpaceBook</h1>
              <p class="text-xs text-blue-600 font-medium">Usuario</p>
            </div>
          </div>

          <!-- User Info -->
          @if (userProfile()) {
            <div class="mb-6 p-4 bg-blue-50 rounded-xl">
              <p class="text-sm font-medium text-gray-900">
                {{ userProfile()?.nombre }} {{ userProfile()?.apellido }}
              </p>
              <p class="text-xs text-gray-500">{{ userProfile()?.correo }}</p>
            </div>
          }

          <!-- Navigation Menu -->
          <nav class="space-y-2">
            <a 
              routerLink="/user-dashboard" 
              routerLinkActive="bg-blue-100 text-blue-700"
              [routerLinkActiveOptions]="{exact: true}"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              <span class="font-medium">Dashboard</span>
            </a>

            <a 
              routerLink="/user-dashboard/catalogo-espacios" 
              routerLinkActive="bg-blue-100 text-blue-700"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              <span class="font-medium">Catálogo de Instituciones</span>
            </a>

            <a 
              routerLink="/user-dashboard/sistema-reservas" 
              routerLinkActive="bg-blue-100 text-blue-700"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <span class="font-medium">Mis Reservas</span>
            </a>
          </nav>

          <!-- Logout Button -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <button 
              (click)="logout()"
              class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors text-red-600"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span class="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 overflow-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: []
})
export class UserDashboardComponent implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);
  
  userProfile = this.auth.profile;

  ngOnInit() {
    // Verificar si es usuario normal, si es admin redirigir
    if (this.auth.isAdmin()) {
      console.log('Redirigiendo a admin dashboard');
      this.router.navigate(['/admin-dashboard']);
    }
  }

  async logout() {
    try {
      await this.auth.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
