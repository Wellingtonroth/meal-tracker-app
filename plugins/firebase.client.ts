import type { Auth } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export default defineNuxtPlugin(() => {
  const cfg = useRuntimeConfig().public.firebase;

  const app: FirebaseApp = getApps().length ? getApps()[0] : initializeApp(cfg);
  const auth: Auth = getAuth(app);

  return {
    provide: {
      firebaseApp: app,
      firebaseAuth: auth,
    },
  };
});

declare module '#app' {
  interface NuxtApp {
    $firebaseApp: FirebaseApp;
    $firebaseAuth: Auth;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $firebaseApp: FirebaseApp;
    $firebaseAuth: Auth;
  }
}
