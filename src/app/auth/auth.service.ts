import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { TokenResponse } from './auth.interface';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  accessToken: string | null = null
  refreshToken: string | null = null

  constructor(private readonly httpClient: HttpClient,
    private readonly cookieService: CookieService,
    private readonly router: Router
  ) { }

  login(payload: { username: string; password: string }) {
    const fd = new FormData()
    fd.append('username', payload.username)
    fd.append('password', payload.password)
    return this.httpClient.post<TokenResponse>('https://icherniakov.ru/yt-course/auth/token', fd).pipe(tap(val => {
      this.saveTokens(val)
    }
    ))
  }

  get isAuth() {
    if (!this.accessToken) {
      this.accessToken = this.cookieService.get('accessToken')
    }
    return !!this.accessToken
  }

  logout() {
    this.cookieService.deleteAll()
    this.accessToken = null
    this.refreshToken = null
    this.router.navigate(['login'])
  }


  refreshAuthTokens() {
    const refreshToken = this.cookieService.get('refreshToken')


    return this.httpClient.post<TokenResponse>('https://icherniakov.ru/yt-course/auth/refresh', { refresh_token: refreshToken }).pipe(tap(res => { this.saveTokens(res) }), catchError((error) => {
      this.logout()
      return throwError(() => error)
    }))
  }

  saveTokens(val: TokenResponse) {
    this.cookieService.set('accessToken', val.access_token)
    this.cookieService.set('refreshToken', val.refresh_token)

    this.accessToken = val.access_token
    this.refreshToken = val.refresh_token
  }
}
