import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StationData {

  apiUrl: string = 'http://127.0.0.1:5001/api/v1.0';
  pageSize: number = 6;

  constructor(private http: HttpClient) { }

  // GET /stations?pn=1&ps=6&area=...&size=...&facility=...&open_24_hours=true
  getStations(page: number, filters: any): Observable<any> {
    let params = new HttpParams()
      .set('pn', page)
      .set('ps', this.pageSize);

    // Only add a filter to the URL if the user chose one
    if (filters.area) {
      params = params.set('area', filters.area);
    }
    if (filters.size) {
      params = params.set('size', filters.size);
    }
    if (filters.facility) {
      params = params.set('facility', filters.facility);
    }
    if (filters.open24) {
      params = params.set('open_24_hours', 'true');
    }

    return this.http.get<any>(this.apiUrl + '/stations', { params });
  }

  // GET /stations/{id} - one station with its lockers
  getStation(id: any): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/stations/' + id);
  }
}