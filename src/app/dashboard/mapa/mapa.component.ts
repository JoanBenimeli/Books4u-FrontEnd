import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapMarker, MapInfoWindow, MapGeocoder } from '@angular/google-maps';
import { MatTabsModule } from '@angular/material/tabs';
import { Local } from '../../interfaces/local';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../interfaces/usuario';

export interface MapGeocoderResponse {
  status: google.maps.GeocoderStatus;
  results: google.maps.GeocoderResult[];
}

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [GoogleMap, MapMarker, MapInfoWindow,MatTabsModule],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.scss'
})
export class MapaComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  center: google.maps.LatLngLiteral = { lat: 39.461762647173806, lng: -0.3807531782083331 };
  zoom = 12;
  display!: google.maps.LatLngLiteral;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];

  constructor(private route: ActivatedRoute, private geocoder: MapGeocoder, private authServ: AuthService) { }

  locales!: Local[]
  localesFiltr!: Local[]
  userLog!: Usuario

  ngOnInit(): void {
    this.route.data.subscribe(({ locales }) => this.locales = locales)
    this.localesFiltr = this.locales
    this.localesFiltr.forEach(local => {
      this.markerPositions.push({ lat: local.latitud, lng: local.longitud })
    });

    this.userLog = this.authServ.getUser()
    console.log(this.userLog)

    if (this.userLog) {
      let direccion = this.userLog.provincia + " " + this.userLog.poblacion
      this.geocoder.geocode({
        address: direccion
      }).subscribe(({ results }) => {
        if (results.length > 0) {
          this.center = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() }
          this.zoom = 13
        }
      });
    }
  }


  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.center = (event.latLng.toJSON());
    }
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.display = event.latLng.toJSON();
    }
  }

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      console.log(this.markerPositions)
      this.markerPositions.push(event.latLng.toJSON());
    }
  }

  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }

  enfocar(local: Local) {
    this.center = { lat: local.latitud, lng: local.longitud }
    this.zoom = 18;
  }

  filtrar(event: Event) {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    this.localesFiltr = this.locales.filter(local =>
      local.comunidad.toLowerCase().includes(input) ||
      local.provincia.toLowerCase().includes(input) ||
      local.nombre.toLowerCase().includes(input) ||
      local.poblacion.toLowerCase().includes(input)
    );

    this.markerPositions = []
    this.localesFiltr.forEach(local => {
      this.markerPositions.push({ lat: local.latitud, lng: local.longitud })
    });
  }
}
