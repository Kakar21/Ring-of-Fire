import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), importProvidersFrom(provideFirebaseApp(() => initializeApp({ "projectId": "ring-of-fire-3f231", "appId": "1:429704941716:web:6a5540b7818ca294b8a481", "storageBucket": "ring-of-fire-3f231.appspot.com", "apiKey": "AIzaSyCvhpTMLLgmRtOS_DU7gi_7eFUiK9XKedg", "authDomain": "ring-of-fire-3f231.firebaseapp.com", "messagingSenderId": "429704941716" }))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
