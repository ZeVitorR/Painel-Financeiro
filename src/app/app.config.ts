import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { PoHttpRequestModule } from '@po-ui/ng-components';
import { jwtInterceptor } from './jwtInterceptor';
import { ProtheusLibCoreModule } from '@totvs/protheus-lib-core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    importProvidersFrom([BrowserAnimationsModule, PoHttpRequestModule, ProtheusLibCoreModule]),
    { provide: HTTP_INTERCEPTORS, useClass: jwtInterceptor, multi: true },
    provideAnimations(),
    provideAnimations()
],

};
