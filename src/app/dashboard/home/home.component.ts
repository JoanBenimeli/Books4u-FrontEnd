import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger)


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  dark:boolean = false
  constructor(private router: Router) { }

  ngOnInit(): void {
    
    if (sessionStorage.getItem("theme") == "dark") {
      const cover = document.getElementById('image-cover')
      cover?.classList.remove('whiteCover')
      cover?.classList.add('blackCover')
    }

    setTimeout(() => {
      this.initAnimations()
    }, 1000);
  }

  shop() {
    this.router.navigate(['/lista']);
  }

  initAnimations() {
    let mQery = gsap.matchMedia()
  
    mQery.add("(min-width: 768px)", () =>{
      gsap.from(".animation1", {
        x: -100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".animation1box",
          start: "-70px 40%",
          end: "bottom 40%",
          toggleActions: "restart reverse restart reverse"
        }
      })
  
      gsap.to("#image-cover",{
        height: 0,
        duration:1,
        scrollTrigger: {
          trigger: ".animation1box",
          start: "-70px 40%",
          end: "bottom 40%",
          toggleActions: "restart reverse restart reverse"
        }
      })
  
      gsap.to(".palabra",{
        y:0,
        stagger: 0.1,
        duration: 1,
        opacity:1,
        scrollTrigger: {
          trigger: ".animation1box",
          start: "-70px 40%",
          end: "bottom 40%",
          toggleActions: "restart reverse restart reverse"
        }
      })
  
      gsap.to(".text-dawn", {
        y:"100%",
        scrollTrigger: {
          trigger: ".text-dawn", 
          start: "-50px 100px",
          scrub:1,
        }
      });
    })
  }

  store(){
    this.router.navigate(['/lista'])
  }

  subir(){
    this.router.navigate(['/subir'])
  }

}
