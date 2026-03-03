import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'Books4u';
  dark = false
  carga:boolean  = false

  constructor(private authUser: AuthService) {}

  ngOnInit(): void {
    if (this.authUser.getUser() === undefined) {
      this.authUser.getUserId().subscribe(
        response => {
          this.carga = true
          this.authUser.setUser(response)
        },
        error =>{
          this.carga = true
          sessionStorage.removeItem('token')
          console.error('Usuario no autenticado')
        }
      )
    } else {
      console.log('El usuario ha iniciado sesión');
    }
  }
}
