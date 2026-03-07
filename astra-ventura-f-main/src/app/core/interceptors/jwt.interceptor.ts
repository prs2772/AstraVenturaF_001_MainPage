import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const accessToken = this.authService.getAccessToken();

        if (accessToken && !req.url.includes('/auth')) {
            req = this.addToken(req, accessToken);
        }

        return next.handle(req).pipe(
            catchError(error => {

                if (error instanceof HttpErrorResponse
                    && error.status === 401
                    && !req.url.includes('/auth/refresh')) {
                    return this.handle401Error(req, next);
                }

                return throwError(() => error);

            })
        );
    }

    private addToken(request: HttpRequest<any>, token: string) {

        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {

        if (!this.isRefreshing) {

            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken().pipe(

                switchMap((response: any) => {

                    this.isRefreshing = false;

                    const newToken = response.accessToken;

                    this.authService.saveAccessToken(newToken);

                    this.refreshTokenSubject.next(newToken);

                    return next.handle(this.addToken(request, newToken));

                }),

                catchError(err => {

                    this.isRefreshing = false;
                    this.authService.logout();

                    return throwError(() => err);

                })

            );

        }

        return this.refreshTokenSubject.pipe(

            filter(token => token != null),
            take(1),

            switchMap(token => {

                return next.handle(this.addToken(request, token!));

            })

        );

    }

}
