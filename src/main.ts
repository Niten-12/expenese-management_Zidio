// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './app/services/interceptors/auth.interceptor';

// ✅ Import HttpClientModule only where actually used
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
// ✅ Import ngx-toastr
import { ToastrModule } from 'ngx-toastr';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      ToastrModule.forRoot({
        positionClass: 'toast-bottom-right',
        closeButton: true,
        progressBar: true,
        timeOut: 4000,
      })
    ),
    provideAnimations(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
}).catch((err) => console.error('❌ Bootstrap error:', err));

// import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { AuthInterceptor } from './services/auth/auth.interceptor';

// providers: [
//   provideHttpClient(withInterceptors([() => new AuthInterceptor(new TokenService())]))
// ]
