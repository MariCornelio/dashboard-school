import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private router: Router) {}
  // TODO:Agregar logica en la funcion Login
  ngOnInit(): void {
    const role: string = 'admin';
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'teacher':
        this.router.navigate(['/profesor']);
        break;
      case 'student':
        this.router.navigate(['/alumno']);
        break;
    }
  }
}
