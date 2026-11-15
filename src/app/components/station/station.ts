import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StationData } from '../../services/station-data';

@Component({
  selector: 'app-station',
  imports: [RouterModule],
  templateUrl: './station.html',
  styleUrl: './station.css'
})
export class Station {

  station: any = null;
  errorMessage: string = '';

  constructor(private stationData: StationData,
              private route: ActivatedRoute) { }

  ngOnInit() {
    // Read the id from the URL, e.g. /stations/STN001
    const id = this.route.snapshot.paramMap.get('id');

    this.stationData.getStation(id).subscribe({
      next: (response: any) => {
        this.station = response;
      },
      error: () => {
        this.errorMessage = 'Station not found.';
      }
    });
  }
}