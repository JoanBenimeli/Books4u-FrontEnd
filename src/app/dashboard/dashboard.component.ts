import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { BusquedaService } from '../services/busqueda.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../interfaces/usuario';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  userLog!: Usuario
  dark!: boolean

  constructor(private router: Router, private busquedaServ: BusquedaService, private authServ: AuthService) { }

  ngOnInit(): void {
    const darkChanger = document.getElementsByClassName('darkChanger')

    this.userLog = this.authServ.getUser()
    console.log(this.userLog)

    if (sessionStorage.getItem("theme") == "dark") {
      this.dark = true
      console.log("dark")
      for (let i = 0; i < darkChanger.length; i++) {
        darkChanger[i].classList.add('darkMode');
      }
    } else {
      this.dark = false
      console.log('no dark')
      for (let i = 0; i < darkChanger.length; i++) {
        darkChanger[i].classList.remove('darkMode');
      }
    }
  }

  registrarse() {
    this.router.navigate(['login']);
  }

  subir() {
    this.router.navigate(['/subir']);
  }

  admin() {
    this.router.navigate(['/admin']);
  }

  favoritos() {
    this.router.navigate(['/favoritos']);
  }

  mapa() {
    this.router.navigate(['/mapa']);
  }

  newShop(){
    this.router.navigate(['/solicitar-local']);
  }

  busqueda(event: Event) {
    let valor = document.getElementById('buscador') as HTMLInputElement
    this.busquedaServ.setBusqueda(valor.value)

    event.preventDefault();
    this.router.navigate(['/lista']);
  }

  changeTheme() {
    const all = document.getElementById("themeSelector")
    const darkChanger = document.getElementsByClassName('darkChanger')
    const homeCover = document.getElementById('image-cover')

    if (!sessionStorage.getItem('theme') || sessionStorage.getItem('theme') != "dark" && sessionStorage.getItem('theme') != "light") {
      sessionStorage.setItem("theme", "light");
      this.dark = false;
      all?.removeAttribute('data-bs-theme')
      homeCover?.classList.remove('blackCover')
      homeCover?.classList.add('whiteCover')
      for (let i = 0; i < darkChanger.length; i++) {
        darkChanger[i].classList.remove('darkMode');
      }
    } else {
      if (sessionStorage.getItem('theme') == "dark") {
        sessionStorage.setItem("theme", "light");
        this.dark = false;
        all?.removeAttribute('data-bs-theme')
        homeCover?.classList.remove('blackCover')
        homeCover?.classList.add('whiteCover')
        for (let i = 0; i < darkChanger.length; i++) {
          darkChanger[i].classList.remove('darkMode');
        }
      } else if (sessionStorage.getItem('theme') == "light") {
        sessionStorage.setItem("theme", "dark");
        this.dark = true;
        all?.setAttribute('data-bs-theme', 'dark')
        homeCover?.classList.remove('whiteCover')
        homeCover?.classList.add('blackCover')
        for (let i = 0; i < darkChanger.length; i++) {
          darkChanger[i].classList.add('darkMode');
        }
      }
    }
  }

  logout(){
    const logout = {
      email:this.authServ.getUser().email
    }
    this.authServ.logout(logout).subscribe(
      response=>{
        sessionStorage.removeItem('token')
        window.location.reload();
        this.router.navigate(['/'])
      },
      error=>console.error(error)
    )
  }

  goProfile(){
    this.router.navigate(['profile/' + this.userLog.id])
  }
}
