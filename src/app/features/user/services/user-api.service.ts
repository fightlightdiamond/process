import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "../models/user.model";

@Injectable({ providedIn: "root" })
export class UserApiService {
  private readonly apiUrl = "http://localhost:3000/users";

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http
      .get<User[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  create(data: Omit<User, "id">): Observable<User> {
    return this.http
      .post<User>(this.apiUrl, data)
      .pipe(catchError(this.handleError));
  }

  update(id: string, updates: Partial<User>): Observable<User> {
    return this.http
      .patch<User>(`${this.apiUrl}/${id}`, updates)
      .pipe(catchError(this.handleError));
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = "Có lỗi xảy ra";

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage =
          "Không thể kết nối đến server. Vui lòng kiểm tra JSON Server đã chạy?";
      } else if (error.status === 404) {
        errorMessage = "Dữ liệu không tìm thấy";
      } else {
        errorMessage = `Lỗi server: ${error.status} - ${error.statusText}`;
      }
    }

    console.error(errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
