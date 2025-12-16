import type { Auth } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

interface FirebasePluginReturn {
  provide: {
    firebaseApp: FirebaseApp | null;
    firebaseAuth: Auth | null;
  };
}

export default defineNuxtPlugin((): FirebasePluginReturn => {
  const cfg = useRuntimeConfig().public.firebase;

  const isConfigValid =
    cfg?.apiKey && cfg?.authDomain && cfg?.projectId && cfg?.appId && cfg?.messagingSenderId;

  if (!isConfigValid) {
    console.warn(
      '[Firebase] Configurações do Firebase não estão completas. Verifique as variáveis de ambiente.',
    );
    return {
      provide: {
        firebaseApp: null,
        firebaseAuth: null,
      },
    };
  }

  try {
    const app: FirebaseApp = getApps().length ? getApps()[0] : initializeApp(cfg);
    const auth: Auth = getAuth(app);

    return {
      provide: {
        firebaseApp: app,
        firebaseAuth: auth,
      },
    };
  } catch (error: any) {
    console.error('[Firebase] Erro ao inicializar Firebase:', error);
    return {
      provide: {
        firebaseApp: null,
        firebaseAuth: null,
      },
    };
  }
});

declare module '#app' {
  interface NuxtApp {
    $firebaseApp: FirebaseApp | null;
    $firebaseAuth: Auth | null;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $firebaseApp: FirebaseApp | null;
    $firebaseAuth: Auth | null;
  }
}
