import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { InterceptorService } from './interceptor/interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),importProvidersFrom(HttpClientModule),provideAnimationsAsync(),{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
  ]
};


