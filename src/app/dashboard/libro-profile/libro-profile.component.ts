import { Component, OnInit } from '@angular/core';
import { Libro } from '../../interfaces/libro';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Genero } from '../../interfaces/genero';
import { Usuario } from '../../interfaces/usuario';

import { ICreateOrderRequest, IPayPalConfig, NgxPayPalModule } from 'ngx-paypal';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { LibrosService } from '../../services/libros.service';
import { EmailService } from '../../services/email.service';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-libro-profile',
  standalone: true,
  imports: [NgxPayPalModule,NgxSpinnerModule,RouterLink],
  templateUrl: './libro-profile.component.html',
  styleUrl: './libro-profile.component.scss'
})
export class LibroProfileComponent implements OnInit {
  libro!: Libro
  generos!: Genero[]
  usuario!: Usuario
  userLog!: Usuario

  public payPalConfig?: IPayPalConfig;

  constructor(private route: ActivatedRoute,private spinner:NgxSpinnerService,private libroServ:LibrosService,private router:Router, private emailServ:EmailService, private authServ:AuthService) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ libro }) => this.libro = libro)
    this.generos = this.libro.generos
    this.usuario = this.libro.usuario
    this.userLog = this.authServ.getUser()
    console.log(this.userLog)

    this.initConfig()

    const nameLink = document.getElementById('darkLinkA')
    if(sessionStorage.getItem("theme") != "dark"){
      nameLink?.classList.remove('a-dark')
    }

    const darkChanger = document.getElementsByClassName('darkChanger')

    if (sessionStorage.getItem("theme") == "dark") {
      for (let i = 0; i < darkChanger.length; i++) {
        darkChanger[i].classList.add('darkMode');
      }
    } else {
      for (let i = 0; i < darkChanger.length; i++) {
        darkChanger[i].classList.remove('darkMode');
      }
    }
  }


  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'AUeiMNXCm5-5zdeBapjSA6AatAggd3S6LbfWtCaMrO2rEnJlfelf9FNJYRH39OPqL_9-_ptEfGhqraNC',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'EUR',
            value: this.libro.precio.toString(),
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: this.libro.precio.toString()
              }
            }
          },
          items: [{
            name: this.libro.nombre,
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'EUR',
              value: this.libro.precio.toString(),
            },
          }]
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'horizontal',
        color: 'gold',
        shape: 'rect',
        tagline: false
      },
      onApprove: (data, actions) => {
        this.spinner.show()
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.eliminarLibro()
        this.enviarFactura()
        this.spinner.hide()
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      }
    };
  }


  eliminarLibro(){
    this.libroServ.deleteLibro(this.libro.id).subscribe(
      response=>{
        this.router.navigate(['/lista']);
      },
      error=>{
        console.error("Error al eliminar el libro de la BD:" + error)
      }
    )
  }

  enviarFactura(){
    const datos = {
      libro: this.libro,
      userLog: this.userLog
    }

    console.log(datos)

    this.emailServ.postComentario(datos).subscribe(
      response=>console.log(response),
      error=>console.error(error)
    )
  }

  editarLibro(id:number){
    this.router.navigate(["editar-libro/" + id])
  }

  login(){
    this.router.navigate(['/login'])
  }
}
