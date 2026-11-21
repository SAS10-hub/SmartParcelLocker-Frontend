import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationData {

  apiUrl: string = 'http://127.0.0.1:5001/api/v1.0';

  constructor(private http: HttpClient) { }

  // GET /pricing/estimate?locker_id=...&start=...&end=... (public)
  getPriceEstimate(lockerId: string, start: string, end: string): Observable<any> {
    const params = new HttpParams()
      .set('locker_id', lockerId)
      .set('start', start)
      .set('end', end);
    return this.http.get<any>(this.apiUrl + '/pricing/estimate', { params });
  }

  // POST /reservations - book a locker (the interceptor adds the token)
  createReservation(lockerId: string, start: string, end: string): Observable<any> {
    const formData = new FormData();
    formData.append('locker_id', lockerId);
    formData.append('start_time', start);
    formData.append('end_time', end);
    return this.http.post<any>(this.apiUrl + '/reservations', formData);
  }
    // GET /reservations?pn=1&ps=5&status=confirmed - my bookings
  getMyReservations(page: number, status: string): Observable<any> {
    let params = new HttpParams()
      .set('pn', page)
      .set('ps', 5);
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<any>(this.apiUrl + '/reservations', { params });
  }

  // PATCH /reservations/{id}/cancel
  cancelReservation(id: string): Observable<any> {
    return this.http.patch<any>(this.apiUrl + '/reservations/' + id + '/cancel', null);
  }

  // PUT /reservations/{id} - move the booking to a new time
  rescheduleReservation(id: string, start: string, end: string): Observable<any> {
    const formData = new FormData();
    formData.append('start_time', start);
    formData.append('end_time', end);
    return this.http.put<any>(this.apiUrl + '/reservations/' + id, formData);
  }
}