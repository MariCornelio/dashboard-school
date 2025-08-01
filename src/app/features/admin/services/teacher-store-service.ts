import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeacherStoreService {
  private refreshTeacherSubject = new Subject<void>();

  get refreshTeacherAction$(): Observable<void> {
    return this.refreshTeacherSubject.asObservable();
  }

  triggerRefreshTeacher(): void {
    this.refreshTeacherSubject.next();
  }
}
