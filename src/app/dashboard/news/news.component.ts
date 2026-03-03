import { Component, OnInit } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit {

  ngOnInit(): void {
    this.animation()
  }

  animation() {
    const flair = document.getElementById("flair") as HTMLImageElement
    gsap.set("#flair", { xPercent: -50, yPercent: -50 });

    const slideTrack1 = document.getElementById("slide-track1")
    const slideTrack2 = document.getElementById("slide-track2")
    const slideTrack3 = document.getElementById("slide-track3")

    if(slideTrack1 != undefined && slideTrack2 != undefined && slideTrack3 != undefined){
      let width1 = slideTrack1?.scrollWidth / 2
      let width2 = slideTrack2?.scrollWidth / 2
      let width3 = slideTrack3?.scrollWidth / 2
      const keyframe1 = [
        { transform: "translateX(0)" },
        { transform: "translateX(-"+ width1 +"px)" },
      ]

      const keyframe2 = [
        { transform: "translateX(0)" },
        { transform: "translateX(-"+ width2 +"px)" },
      ]

      const keyframe3 = [
        { transform: "translateX(0)" },
        { transform: "translateX(-"+ width3 +"px)" },
      ]

      const options1 = {
        duration: 80000,
        easing: "linear",
        iterations: Infinity, 
      };

      const options2 = {
        duration: 60000,
        easing: "linear",
        iterations: Infinity, 
      };

      const options3 = {
        duration: 100000,
        easing: "linear",
        iterations: Infinity, 
      };
  
      slideTrack1?.animate(keyframe1,options1)
      slideTrack2?.animate(keyframe1,options2)
      slideTrack3?.animate(keyframe1,options3)
    }




    let xTo = gsap.quickTo("#flair", "x", { duration: 0.6, ease: "power3" }),
      yTo = gsap.quickTo("#flair", "y", { duration: 0.6, ease: "power3" });

    window.addEventListener("mousemove", e => {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    document.querySelectorAll('h3').forEach(h3 => {
      h3.addEventListener('mouseenter', () => {
        flair.style.opacity = "1"
        flair.src = "/assets/img/recomendaciones/" + h3.id
      });

      h3.addEventListener('mouseleave', () => {
        flair.style.opacity = "0"
      });
    })
  }
}
