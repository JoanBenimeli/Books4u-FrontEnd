import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UserLogedService } from '../services/user-loged.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  invalid:boolean = false
  constructor(private authServ:AuthService,private router:Router){}

  userLogin = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
    password: new FormControl('',[Validators.required,Validators.pattern(/^.{8,}$/)])
  })

  get email(){return this.userLogin.get('email')}
  get password(){return this.userLogin.get('password')}

  login(){
    this.authServ.login(this.userLogin.value).subscribe(
      response=>{
        sessionStorage.setItem('token',response.token)
        this.authServ.setUser(response.usuario)
        this.router.navigate(["/"])
      },
      error=>{
        this.invalid = true
        console.error(error)
      }
    )
  }

}
