import { Component, OnInit, ElementRef, AfterViewInit, ViewChild} from '@angular/core';
import { DeckGL } from '@deck.gl/react';
import { Deck } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
// import { TileLayer } from '@deck.gl/geo-layers';
// import { BitmapLayer } from '@deck.gl/layers';

@Component({
  selector: 'app-view-deckgl',
  standalone: true,
  imports: [],
  templateUrl: './view-deckgl.component.html',
  styleUrl: './view-deckgl.component.css'
})
export class ViewDeckglComponent implements OnInit{
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @ViewChild('deckglContainer', { static: true }) deckglContainer!: ElementRef;

  ngOnInit() {
    // Prepare your data here
    const data = [{ position: [-122.45, 37.8], color: [255, 0, 0], radius: 100 }];

    // new DeckGL({
    //   container: this.deckglContainer.nativeElement,
    //   initialViewState: {
    //     longitude: -122.45,
    //     latitude: 37.8,
    //     zoom: 10,
    //   },
    //   layers: [
    //     new ScatterplotLayer({
    //       data,
    //       getPosition: d => d.position,
    //       getFillColor: d => d.color,
    //       getRadius: d => d.radius,
    //     }),
    //   ],
    // });
  }
}
