import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StationData } from '../../services/station-data';
import { ReservationData } from '../../services/reservation-data';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-station',
  imports: [RouterModule, FormsModule],
  templateUrl: './station.html',
  styleUrl: './station.css'
})
export class Station {

  station: any = null;
  errorMessage: string = '';

  // Booking form
  selectedLocker: any = null;
  bookingDate: string = '';
  startHour: number = 10;
  hours: number = 2;
  estimate: any = null;
  bookingError: string = '';
  bookingResult: any = null;
  loading: boolean = false;

  hourOptions: number[] = Array.from({ length: 24 }, (_, i) => i);   // 0 - 23
  durationOptions: number[] = [1, 2, 3, 4, 6, 8, 12, 24];
  minDate: string = '';
  maxDate: string = '';

  constructor(private stationData: StationData,
              private reservationData: ReservationData,
              public auth: Auth,
              private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.stationData.getStation(id).subscribe({
      next: (response: any) => {
        this.station = response;
      },
      error: () => {
        this.errorMessage = 'Station not found.';
      }
    });

    // Bookings can be made from today up to 90 days ahead (API rule)
    const today = new Date();
    this.minDate = this.toDateInput(today);
    this.maxDate = this.toDateInput(new Date(today.getTime() + 89 * 24 * 3600 * 1000));
  }

  // "Book" button on a locker row
  chooseLocker(locker: any) {
    this.selectedLocker = locker;
    this.estimate = null;
    this.bookingError = '';
    this.bookingResult = null;
    // Default date: tomorrow
    this.bookingDate = this.toDateInput(new Date(Date.now() + 24 * 3600 * 1000));
  }

  // Any change to the form means the old price is out of date
  resetEstimate() {
    this.estimate = null;
    this.bookingError = '';
  }

  // GET /pricing/estimate
  checkPrice() {
    const times = this.buildTimes();
    this.bookingError = '';
    this.reservationData.getPriceEstimate(this.selectedLocker.locker_id, times.start, times.end)
      .subscribe({
        next: (response: any) => {
          this.estimate = response;
        },
        error: (err: any) => {
          // e.g. 400 "Start time must be in the future"
          this.bookingError = err.error?.error || 'Could not get a price.';
        }
      });
  }

  // POST /reservations
  confirmBooking() {
    const times = this.buildTimes();
    this.loading = true;
    this.bookingError = '';
    this.reservationData.createReservation(this.selectedLocker.locker_id, times.start, times.end)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.bookingResult = response;
          this.estimate = null;
        },
        error: (err: any) => {
          this.loading = false;
          // e.g. 409 "Locker is already booked for this time"
          this.bookingError = err.error?.error || 'Booking failed.';
        }
      });
  }

  // Turn the chosen date + hour + duration into the API's time format
  buildTimes() {
    const start = new Date(this.bookingDate + 'T00:00:00');   // local time
    start.setHours(this.startHour);
    const end = new Date(start.getTime() + this.hours * 3600 * 1000);
    return { start: this.toApiTime(start), end: this.toApiTime(end) };
  }

  // 2026-11-22T10:00:00.000Z  ->  2026-11-22T10:00:00Z
  toApiTime(date: Date): string {
    return date.toISOString().replace('.000Z', 'Z');
  }

  // Date -> "YYYY-MM-DD" for <input type="date">
  toDateInput(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return date.getFullYear() + '-' + month + '-' + day;
  }

  // 450 pence -> "£4.50"
  pounds(pence: number): string {
    return '£' + (pence / 100).toFixed(2);
  }
}