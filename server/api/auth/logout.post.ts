import { isProduction as isProductionEnv } from '../../utils/env';

export default defineEventHandler(async (event) => {
  try {
    const isProduction = isProductionEnv();

    deleteCookie(event, 'firebase_id_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
    });

    deleteCookie(event, 'firebase_refresh_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
    });

    return {
      success: true,
      message: 'Logout realizado com sucesso',
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao fazer logout',
    });
  }
});
