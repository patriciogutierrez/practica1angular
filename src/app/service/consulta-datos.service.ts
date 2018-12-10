import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Lugar } from '../model/lugar';
import { Valor } from '../model/valor';
import { Observable } from 'rxjs';
//API URL
const apiUrl = 'http://200.10.22.95:3000';
@Injectable({
  providedIn: 'root'
})
export class ConsultaDatosService {

  constructor(private http: HttpClient) { }
  //Obtener los lugares de un usuario
  getLugar(user_id): Observable<any> {
    return this.http.get<Lugar[]>(apiUrl+"/api/lugar/" + user_id);
  }
  //Obtener una variable de un lugar
  getVariable(valor_id, campo): Observable<any> {
    return this.http.get<Valor[]>(apiUrl+"/api/valor/"+ valor_id + "/" + campo);
  }

}
