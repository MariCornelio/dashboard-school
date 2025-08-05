import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel, UserRole } from '../models/users.model';
import { generateUUID } from '../helpers/uuid.helpers';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiURL = `${environment.apiJsonServerURL}/users`;
  //private apiURL = 'http://localhost:8080/users';
  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.apiURL}`);
  }
  createUser(userData: UserModel, role: UserRole): Observable<UserModel> {
    const newUser: UserModel = {
      ...userData,
      id: generateUUID(),
      role,
    };
    return this.http.post<UserModel>(`${this.apiURL}`, newUser);
  }

  updateUser(userId: string, userData: UserModel): Observable<UserModel> {
    return this.http.patch<UserModel>(`${this.apiURL}/${userId}`, userData);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${userId}`);
  }
}
