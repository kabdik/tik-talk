import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { catchError, switchMap, throwError } from "rxjs";

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
    const authService = inject(AuthService)
    const token = authService.accessToken

    if (!token) {
        return next(req)
    }
    return next(addToken(req, token)).pipe(catchError(error => {
        if (error.status === 403) {
            return refreshAndProceed(authService, req, next)
        }
        return throwError(() => error)
    }))
}

const refreshAndProceed = (
    authService: AuthService, req: HttpRequest<any>, next: HttpHandlerFn
) => {
    return authService.refreshAuthTokens().pipe(
        switchMap((res) => { return next(addToken(req, res.access_token)) })
    )

}


const addToken = (req: HttpRequest<any>, token: string) => {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
}