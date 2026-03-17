import { Component } from '@angular/core';

import * as L from 'leaflet';
import 'leaflet-routing-machine';

//geocoder
//import 'leaflet-control-geocoder';
//GPS

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl ='assets/marker-icon.png';
const shadowUrl ='assets/marker-shadow.png';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  protected map: any;
  lat: number = 23.96512;
  lon: number = 46.38381;
  watchID: any;

  options ={
    timeout: 1000,
    enableHighAccuracy: true,
    maximumAge: 500
  };

  constructor() {
   
  }
  ionViewDidEnter() {
    this.getLocalidade();
  }
  getLocalidade(){
    this.watchID = navigator.geolocation.watchPosition((position) => {
      this.lat = position.coords.latitude;
      this.lon = position.coords.latitude;
      
      if (!this.map) {
          this.initMap();
        } else {
          // Se o mapa já existe, apenas centraliza
          this.map.setView([this.lat, this.lon], this.map.getZoom());
        }

      }, (error) => {
        console.log(error.code + '\n' + 'mesage:' + error.message +'\n');
      } , this.options);

    }
    
    private initMap(){

      this.map = L.map('map',{
        center: [this.lat, this.lon],
        attributionControl: false,
        zoom:10
      });

       //personalizar os ícones 
       var iconDefault = L.icon({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
        iconSize:[25,41],
        iconAnchor:[12, 41],
        popupAnchor:[1, -34],
        tooltipAnchor:[16, -28],
        shadowSize:[41,41]
       });
       L.Marker.prototype.options.icon = iconDefault;
       

       //marca com popup
       const lon = this.lon +0.009;
       const lat = this.lat +0.009;

       const tiles= L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom :19,
        attribution:'&copy; <a href = "https://etecdrc.cps.gov.br/cms/">Etec</a>'
       });
       
       //marca circular
       const mark = L.circleMarker([
        this.lat, this.lon
       ]);

       mark.addTo(this.map);
       L.Routing.control({
       router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-orsm.org/route/v1/'
        }),

        showAlternatives : true,
        fitSelectedRoutes: true,
        show: false, //imforma as direcoes na tela
        routeWhileDragging: true,
        waypoints:[
          L.latLng(this.lat, this.lon),
          L.latLng(lat, lon)
        ]
       }).addTo(this.map);

       tiles.addTo(this.map);

    }
  }

  
