import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StationData } from '../../services/station-data';

@Component({
  selector: 'app-stations',
  imports: [RouterModule, FormsModule],
  templateUrl: './stations.html',
  styleUrl: './stations.css'
})
export class Stations {

  station_list: any = [];
  page: number = 1;
  totalPages: number = 1;
  totalResults: number = 0;
  errorMessage: string = '';

  // The current filter choices (empty = no filter)
  filters: any = { area: '', size: '', facility: '', open24: false };

  // Options for the dropdowns (the values used in the dataset)
  areas: string[] = [
    'Battersea', 'Brixton', 'Camden Town', 'Canary Wharf', 'Clapham', 'Croydon',
    'Ealing', 'Finsbury Park', 'Fulham', 'Greenwich', 'Hackney', 'Hammersmith',
    'Holborn', 'Islington', "King's Cross", 'Lewisham', 'London Bridge',
    'Marylebone', 'Paddington', 'Peckham', "Shepherd's Bush", 'Shoreditch',
    'Soho', 'Stratford', 'Walthamstow', 'Waterloo', 'Wembley', 'Westminster',
    'Whitechapel', 'Wimbledon'
  ];
  sizes: string[] = ['small', 'medium', 'large'];
  facilities: string[] = [
    'CCTV', 'Covered canopy', 'Cycle parking', 'Help point', 'Lighting', 'Step-free access'
  ];

  constructor(private stationData: StationData) { }

  ngOnInit() {
    // Restore the page and filters when the user comes back (sessionStorage)
    if (sessionStorage['page']) {
      this.page = Number(sessionStorage['page']);
    }
    if (sessionStorage['filters']) {
      this.filters = JSON.parse(sessionStorage['filters']);
    }
    this.loadStations();
  }

  loadStations() {
    this.errorMessage = '';
    this.stationData.getStations(this.page, this.filters).subscribe({
      next: (response: any) => {
        this.station_list = response.stations;
        this.totalPages = response.total_pages;
        this.totalResults = response.total_results;
      },
      error: (err: any) => {
        // Show the API's own error message if there is one
        this.errorMessage = err.error?.error || 'Could not load stations. Is the API running?';
      }
    });
  }

  // "Search" button: start again from page 1 with the new filters
  applyFilters() {
    this.page = 1;
    sessionStorage['page'] = this.page;
    sessionStorage['filters'] = JSON.stringify(this.filters);
    this.loadStations();
  }

  // "Clear" button: remove all filters
  clearFilters() {
    this.filters = { area: '', size: '', facility: '', open24: false };
    this.applyFilters();
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page = this.page + 1;
      sessionStorage['page'] = this.page;
      this.loadStations();
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page = this.page - 1;
      sessionStorage['page'] = this.page;
      this.loadStations();
    }
  }
}