import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { apis } from '../../../environments/apis.environment';
import { CredentialsReq, RefreshTokenReq, RegisterNewReq } from '../../features/auth/models/auth-req.model';
import { AuthRes } from '../../features/auth/models/auth-res.model';
import { PersonIdentity } from '../../shared/models/person-identity';
import { AuthMapper } from '../../shared/utils/mappers/auth.mapper';
import { StorageUtil } from '../../shared/utils/storage.util';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly ACCESS_KEY = 'access_token';
  private readonly REFRESH_KEY = 'refresh_token';
  private readonly USER_KEY = 'auth_user';

  private base = apis.authApiUrl;

  // Estado reactivo del usuario actual
  private currentUserSubject = new BehaviorSubject<PersonIdentity | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // Login
  login(credenciales: CredentialsReq): Observable<AuthRes> {
    return this.http.post<AuthRes>(`${this.base}/login`, credenciales).pipe(
      tap(res => this.saveSession(res))
    );
  }

  // Registro
  register(registerNew: RegisterNewReq): Observable<AuthRes> {
    return this.http.post<AuthRes>(`${this.base}/register`, registerNew).pipe(
      tap(res => this.saveSession(res))
    );
  }

  // Refresh Token
  refreshToken(): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      `${this.base}/refresh`, this.getRefreshToken()
    );
  }

  // Cerrar mi sesión
  logout(): void {
    StorageUtil.remove(this.ACCESS_KEY);
    StorageUtil.remove(this.REFRESH_KEY);
    StorageUtil.remove(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  // Interceptor - getters
  getAccessToken(): string | null {
    return StorageUtil.get(this.ACCESS_KEY);
  }

  getRefreshToken(): RefreshTokenReq | null {
    const token = StorageUtil.get(this.REFRESH_KEY);
    if (!token) {
      return null;
    }
    return { refreshToken: token };
  }

  saveAccessToken(token: string): void {
    StorageUtil.set(this.ACCESS_KEY, token);
  }

  // Obtención de estado de sesión
  get isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  get currentUser(): PersonIdentity | null {
    return this.currentUserSubject.value;
  }

  // Métodos privados
  private saveSession(res: AuthRes): void {
    StorageUtil.set(this.ACCESS_KEY, res.accessToken);
    StorageUtil.set(this.REFRESH_KEY, res.refreshToken);
    StorageUtil.set(this.USER_KEY, JSON.stringify(AuthMapper.toPersonIdentity(res)));
    this.currentUserSubject.next(AuthMapper.toPersonIdentity(res));
  }

  private loadUser(): PersonIdentity | null {
    const raw = StorageUtil.get(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
