import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';
import { ReservationData } from '../../services/reservation-data';

@Component({
  selector: 'app-my-bookings',
  imports: [RouterModule, FormsModule, DatePipe, NgClass],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css'
})
export class MyBookings {

  reservations: any = [];
  page: number = 1;
  totalPages: number = 1;
  totalResults: number = 0;
  statusFilter: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  statuses: string[] = ['confirmed', 'active', 'completed', 'cancelled', 'expired'];

  // Reschedule form (shown under one booking at a time)
  editingId: string = '';
  editDate: string = '';
  editHour: number = 10;
  editHours: number = 2;
  editError: string = '';
  hourOptions: number[] = Array.from({ length: 24 }, (_, i) => i);
  durationOptions: number[] = [1, 2, 3, 4, 6, 8, 12, 24];

  constructor(private reservationData: ReservationData) { }

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.errorMessage = '';
    this.reservationData.getMyReservations(this.page, this.statusFilter).subscribe({
      next: (response: any) => {
        this.reservations = response.reservations;
        this.totalPages = response.total_pages;
        this.totalResults = response.total_results;
      },
      error: (err: any) => {
        this.errorMessage = err.error?.error || 'Could not load your bookings.';
      }
    });
  }

  applyFilter() {
    this.page = 1;
    this.loadReservations();
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page = this.page + 1;
      this.loadReservations();
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page = this.page - 1;
      this.loadReservations();
    }
  }

  // Same rule as the API: only confirmed bookings that have not started
  canChange(reservation: any): boolean {
    return reservation.status === 'confirmed' && new Date(reservation.start_time) > new Date();
  }

  // PATCH /reservations/{id}/cancel
  cancel(reservation: any) {
    if (!confirm('Cancel booking ' + reservation.reservation_id + '?')) {
      return;
    }
    this.successMessage = '';
    this.reservationData.cancelReservation(reservation.reservation_id).subscribe({
      next: () => {
        this.successMessage = 'Booking ' + reservation.reservation_id + ' was cancelled.';
        this.loadReservations();
      },
      error: (err: any) => {
        this.errorMessage = err.error?.error || 'Could not cancel the booking.';
      }
    });
  }

  // Open the reschedule form, filled with the booking's current time
  startReschedule(reservation: any) {
    const start = new Date(reservation.start_time);
    this.editingId = reservation.reservation_id;
    this.editDate = this.toDateInput(start);
    this.editHour = start.getHours();
    this.editHours = reservation.price_breakdown.booked_hours;
    this.editError = '';
    this.successMessage = '';
  }

  closeReschedule() {
    this.editingId = '';
  }

  // PUT /reservations/{id}
  saveReschedule(reservation: any) {
    const start = new Date(this.editDate + 'T00:00:00');
    start.setHours(this.editHour);
    const end = new Date(start.getTime() + this.editHours * 3600 * 1000);

    this.reservationData.rescheduleReservation(
      reservation.reservation_id, this.toApiTime(start), this.toApiTime(end)
    ).subscribe({
      next: () => {
        this.successMessage = 'Booking ' + reservation.reservation_id + ' was rescheduled.';
        this.editingId = '';
        this.loadReservations();
      },
      error: (err: any) => {
        // e.g. 409 "Locker is already booked for this time"
        this.editError = err.error?.error || 'Could not reschedule.';
      }
    });
  }

  // Bootstrap colour for each status badge
  statusClass(status: string): string {
    switch (status) {
      case 'confirmed': return 'bg-primary';
      case 'active': return 'bg-warning text-dark';
      case 'completed': return 'bg-success';
      case 'cancelled': return 'bg-secondary';
      default: return 'bg-dark';      // expired
    }
  }

  toApiTime(date: Date): string {
    return date.toISOString().replace('.000Z', 'Z');
  }

  toDateInput(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return date.getFullYear() + '-' + month + '-' + day;
  }

  pounds(pence: number): string {
    return '£' + (pence / 100).toFixed(2);
  }
}