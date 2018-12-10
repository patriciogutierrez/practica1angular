import { Component, OnInit, ViewChild } from '@angular/core';
import { ConsultaDatosService } from '../service/consulta-datos.service';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Lugar } from '../model/lugar';
import { Chart } from 'chart.js';
//Variable mapa
declare let L;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {
  //Variables para crear icono/marker de Leaflet
  public myCustomColour = ''
  public markerHtmlStyles = ''
  public icon: any;
  ///////////////

  //Referencia tabla  
  @ViewChild('myChart') private chartRef;
  chart: any;
  title = '';
  consultaDatos;
  dataPoints = [];
  lugar: Lugar;
  color: string = 'red';
  public columna;
  public dataPointsLabel = [];
  public dataPointsValue = [];
  jwtHelper = new JwtHelperService();
  isTable: any;
  constructor(private consultaService: ConsultaDatosService) { }

  //Leaflet
  //Crear mapa con lugares asignados a usuario
  //Obtiene id a traves de token
  ngOnInit() {
    let userId = this.jwtHelper.decodeToken(localStorage.getItem('access_token')).userID;
    let map = L.map('mapid').setView([-33.469, -70.641], 5);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      maxZoom: 18,
      id: 'mapbox.streets'
    }).addTo(map);
    this.consultaService.getLugar(userId).subscribe(value => {
      this.consultaDatos = value;
      this.poblarMapa(map);
    });

  }

  //Obtener lugares desde API
  poblarMapa(map) {
    this.consultaDatos.forEach(element => {
      let marker;
      this.myCustomColour = `rgb(${element.color})`
      //crear marcador indicando latitud longitud de lugar
      marker = L.marker([element.latitud, element.longitud], { icon: this.createIcon() }).addTo(map)
      marker.on('click', (evt) => {
        this.lugar = element;
        this.plotVariable(this.columna);
      }).on('mouseover', (evt) => {
        marker.bindTooltip('<p>' + element.nombre + "</p>").openTooltip();
      });
    });
  }

  //Obtener variable a plotear(columna debe tener el mismo nombre que la columna de la base de datos)
  //Asignar labels, mismo color del lugar y valores para crear tabla
  plotVariable(columna) {
    if (this.columna == null) {
      columna = 'T2';
    }
    this.color = `rgb(${this.lugar.color})`;
    this.columna = columna;
    this.title = columna;
    this.dataPointsLabel = [];
    this.dataPointsValue = [];
    //Obtener variable
    let tipoValor = this.consultaService.getVariable(this.lugar.id, columna);
    tipoValor.subscribe(values => {
      values.forEach(element => {
        //Asignar fecha y valor a arrays
        this.dataPointsLabel.push(this.parseFecha(element.fecha));
        this.dataPointsValue.push(element.parametro);
      });
      this.createTable();
      this.isTable = 1;
    });
  }



  //ChartJS
  //Crear tabla por al consultar una variable
  createTable() {
    if (this.isTable) this.chart.destroy();
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: this.dataPointsLabel,
        datasets: [{
            label: this.title,
            data: this.dataPointsValue,
            borderColor: this.color,
            fill: true,
          }]
      },
      options: {
        legend: { display: true, },
        title: {
          display: false,
          text: this.lugar.nombre,
        },
        scales: {
          xAxes: [{ display: true }],
          yAxes: [{ display: true }],
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    }
    )
  }

  //Transformar fecha recibida en formato DD-MM-YYYY HH:MM:SS (MM abreviacion en ingles)
  parseFecha(fecha) {
    let splittedFecha: any[] = fecha.split(" ");
    let getfechadia = splittedFecha[0].split("-");
    let getfechahora: any[] = [0, 0, 0]
    if (splittedFecha.length == 2) {
      getfechahora = fecha.split(" ")[1].split(":").map(Number);
    }
    fecha = new Date(Number(getfechadia[2]), this.getMonth(getfechadia[1]), Number(getfechadia[0]),
      getfechahora[0], getfechahora[1], getfechahora[2]).toLocaleString();
    return   fecha;
  }

  //Crear icono para mostrar en mapa, asignando color del lugar
  createIcon() {
    this.markerHtmlStyles = `
      background-color: ${this.myCustomColour};
      width: 3rem;
      height: 3rem;
      display: block;
      left: -1.5rem;
      top: -1.5rem;
      position: relative;
      border-radius: 3rem 3rem 0;
      transform: rotate(45deg);
      border: 1px solid #FFFFFF`

    return this.icon = L.divIcon({
      className: "my-custom-pin",
      iconAnchor: [0, 24],
      labelAnchor: [-6, 0],
      popupAnchor: [0, -36],
      html: `<span style="${this.markerHtmlStyles}" />`
    });
  }

  //Asignar abreviacion mes ingles a int
  getMonth(month) {
    switch (month) {
      case "Jan": return 0;
      case "Feb": return 1;
      case "Mar": return 2;
      case "Apr": return 3;
      case "May": return 4;
      case "Jun": return 5;
      case "Jul": return 6;
      case "Aug": return 7;
      case "Sept": return 8;
      case "Oct": return 9;
      case "Nov": return 10;
      case "Dec": return 11;

    }
  }







}
