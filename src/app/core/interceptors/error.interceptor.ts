import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
      let errorType = 'error';
      let shouldRedirect = false;

      // Gestion des erreurs spécifiques
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 400:
            errorMessage = error.error?.erreur || 'Requête invalide. Vérifiez vos données.';
            errorType = 'validation';
            break;
            
          case 401:
            if (auth.getToken()) {
              auth.deconnecter();
              router.navigate(['/login']);
              errorMessage = 'Session expirée. Veuillez vous reconnecter.';
              shouldRedirect = true;
            } else {
              errorMessage = 'Accès non autorisé. Veuillez vous connecter.';
            }
            break;
            
          case 403:
            errorMessage = error.error?.erreur || 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
            errorType = 'forbidden';
            break;
            
          case 404:
            errorMessage = error.error?.erreur || 'Ressource non trouvée.';
            errorType = 'not-found';
            break;
            
          case 409:
            errorMessage = error.error?.erreur || 'Conflit. Cette ressource existe déjà ou est en conflit.';
            errorType = 'conflict';
            break;
            
          case 413:
            errorMessage = 'Fichier trop volumineux. La taille maximale autorisée est de 10 Mo.';
            errorType = 'file-size';
            break;
            
          case 422:
            errorMessage = 'Données invalides. Veuillez vérifier vos informations.';
            errorType = 'validation';
            break;
            
          case 500:
            errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
            errorType = 'server';
            break;
            
          case 503:
            errorMessage = 'Service temporairement indisponible. Veuillez réessayer plus tard.';
            errorType = 'service-unavailable';
            break;
            
          default:
            errorMessage = error.error?.erreur || `Erreur ${error.status}: ${error.statusText}`;
        }
      }

      // Afficher l'erreur dans la console pour le débogage
      console.error('HTTP Error:', {
        url: req.url,
        status: error.status,
        message: errorMessage,
        error: error.error
      });

      // Ne pas rediriger si c'est une erreur de validation (pour garder l'utilisateur sur la page)
      if (!shouldRedirect && errorType !== 'validation') {
        // On pourrait ici déclencher un service de notification global
        // Par exemple: NotificationService.show(errorMessage, errorType);
      }

      return throwError(() => ({
        ...error,
        userMessage: errorMessage,
        errorType,
        shouldRedirect
      }));
    })
  );
};