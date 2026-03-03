/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

let dark:boolean = false
const all = document.getElementById("themeSelector")

if(!sessionStorage.getItem('theme') || sessionStorage.getItem('theme') != "dark" && sessionStorage.getItem('theme') != "light"){
  sessionStorage.setItem("theme","light");
  dark = false;
  all?.removeAttribute('data-bs-theme')
}else{
  if(sessionStorage.getItem('theme') == "dark"){
    dark = true;
    all?.setAttribute('data-bs-theme','dark')
  }else if(sessionStorage.getItem('theme') == "light"){
    dark = false
    all?.removeAttribute('data-bs-theme')
  }
}