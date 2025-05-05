import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-view-googlemap',
  standalone: true,
  imports: [],
  templateUrl: './view-googlemap.component.html',
  styleUrl: './view-googlemap.component.css'
})
export class ViewGooglemapComponent implements OnInit {
  ngOnInit(): void {
    let loader = new Loader({
      apiKey: 'AIzaSyDPGmpMAfEW9hQxtGiISM8zNT-y_gQdaWE'
    })

    loader.load().then(() => {
      const mapElement = document.getElementById("map");
      if (mapElement) {
        const map = new google.maps.Map(mapElement, {
          center: {lat: 48.064817355961466, lng: 6.29704075071091},
          zoom: 4
        });

        const imageBounds = {
          north: 60.15622631725923, // 50.773941,
          south: 42.05333657026676, // 45.712216,
          east: 33.77742545811928, // 8.42544,
          west: -4.816534709314306, // 1.12655,
        };
      
        const historicalOverlay = new google.maps.GroundOverlay(
          "../../assets/MSG3-SEVI-MSG15-0100-NA-20170102122740.989000000Z-NA_HRV_merc_grey.png",
          // "../../assets/MSG3-SEVI-MSG15-0100-NA-20170102122740.989000000Z-NA_HRV_merc_color.png",
          imageBounds,
        );
        historicalOverlay.setMap(map);

      } else {
        console.error('Map element not found!')
      }

      


    });
  }

}
