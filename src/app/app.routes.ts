import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ListaLibrosComponent } from './dashboard/lista-libros/lista-libros.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
import { VenderFormComponent } from './dashboard/vender-form/vender-form.component';
import { UserProfileComponent } from './dashboard/user-profile/user-profile.component';
import { LibroProfileComponent } from './dashboard/libro-profile/libro-profile.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { GenerosTableComponent } from './admin-dashboard/generos-table/generos-table.component';
import { AutoresTableComponent } from './admin-dashboard/autores-table/autores-table.component';
import { UsersTableComponent } from './admin-dashboard/users-table/users-table.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';
import { LocalesTableComponent } from './admin-dashboard/locales-table/locales-table.component';
import { CrearUsuarioComponent } from './admin-dashboard/crear-usuario/crear-usuario.component';
import { LibrosFavsComponent } from './dashboard/libros-favs/libros-favs.component';
import { FormLocalComponent } from './admin-dashboard/form-local/form-local.component';
import { MapaComponent } from './dashboard/mapa/mapa.component';
import { SolicitarLocalComponent } from './dashboard/solicitar-local/solicitar-local.component';
import { UpdateBookComponent } from './dashboard/update-book/update-book.component';
import { EditarUserComponent } from './dashboard/editar-user/editar-user.component';
import { NewsComponent } from './dashboard/news/news.component';

import { libroResolver } from './resolvers/libro.resolver';
import { generoResolver } from './resolvers/genero.resolver';
import { generoVerifResolver } from './resolvers/genero-verif.resolver';
import { autorResolver } from './resolvers/autor.resolver';
import { autorVerifResolver } from './resolvers/autor-verif.resolver';
import { userIdResolver } from './resolvers/user-id.resolver';
import { libroIdResolver } from './resolvers/libro-id.resolver';
import { usuarioResolver } from './resolvers/usuario.resolver';
import { localesResolver } from './resolvers/locales.resolver';
import { listaResolverResolver } from './resolvers/lista-resolver.resolver';
import { localIdResolver } from './resolvers/local-id.resolver';
import { localVerifResolver } from './resolvers/local-verif.resolver';
import { rolesResolver } from './resolvers/roles.resolver';

import { AuthGuard } from './guards/auth.guard';
import { notLoggedGuard } from './guards/not-logged.guard';
import { adminGuardGuard } from './guards/admin-guard.guard';
import { editUserGuard } from './guards/edit-user.guard';
import { editBookGuard } from './guards/edit-book.guard';
import { favGuard } from './guards/fav.guard';


export const routes: Routes = [
    {path:'login',loadComponent: () => import('./login/login.component').then(c => c.LoginComponent),canActivate:[notLoggedGuard]},
    {path:'register',loadComponent: () => import('./register/register.component').then(c => c.RegisterComponent)},
    {path:'',loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent) ,children: [
        {path:'',loadComponent: () => import('./dashboard/home/home.component').then(c => c.HomeComponent)},
        {path:'lista', component:ListaLibrosComponent,resolve: { libros: libroResolver,autores:autorVerifResolver,generos:generoVerifResolver}},
        {path:'favoritos',component:LibrosFavsComponent,resolve: { lista:listaResolverResolver }, canActivate:[AuthGuard,favGuard]},
        {path:'subir', component:VenderFormComponent,resolve:{ generos:generoVerifResolver,autores:autorVerifResolver },canActivate:[AuthGuard]},
        {path:'profile/:id', component:UserProfileComponent,resolve:{usuario:userIdResolver}},
        {path: 'news', component:NewsComponent},
        {path:'libro/:id', component:LibroProfileComponent,resolve:{libro:libroIdResolver}},
        {path:'editar-libro/:id', component:UpdateBookComponent,resolve:{libro:libroIdResolver,generos:generoVerifResolver,autores:autorVerifResolver}, canActivate:[AuthGuard,editBookGuard]},
        {path:'mapa', component:MapaComponent,resolve:{locales:localVerifResolver}},
        {path:'solicitar-local',component:SolicitarLocalComponent,canActivate:[AuthGuard]},
        {path:'edit-user/:id',component:EditarUserComponent, resolve:{usuario:userIdResolver}, canActivate:[AuthGuard,editUserGuard]},
        {path: 'admin',loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent),canActivate:[AuthGuard,adminGuardGuard],children: [
            { path: '', redirectTo: 'generos', pathMatch: 'full' },
            {path:'generos',component:GenerosTableComponent,resolve:{ generos:generoResolver}},
            {path:'autores',component:AutoresTableComponent,resolve:{ autores:autorResolver}},
            {path:'usuarios',component:UsersTableComponent,resolve:{ usuarios:usuarioResolver}},
            {path:'locales',component:LocalesTableComponent,resolve:{locales:localesResolver}},
            {path:'new-usuario',component:CrearUsuarioComponent,resolve:{roles:rolesResolver}},
            {path:'update-usuario/:id',component:CrearUsuarioComponent, resolve:{usuario:userIdResolver, roles:rolesResolver}},
            {path:'new-local',component:FormLocalComponent},
            {path:'update-local/:id',component:FormLocalComponent, resolve:{local:localIdResolver}}
        ]},
    ]},
    {path:'**',redirectTo: '/', pathMatch: 'full'}
];
