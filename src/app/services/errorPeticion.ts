import { HttpErrorResponse } from "@angular/common/http";
import { Inject, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { UserLogedService } from "./user-loged.service";

export default function errorPeticion<T>(error: HttpErrorResponse): Observable<T> {
    if (error.status == 0)
        return throwError(() => new Error("No se pudo conectar con el servidor"));
    else if (error.status == 401) {
        sessionStorage.removeItem("token")
        //inject(UserLogedService).setUser(null)
        window.location.href = "/login";
        return throwError(() => new Error("Usuario no autenticado"));
    }
    else
        return throwError(() => new Error("Error en la petición." + error.status + error.statusText));
}

