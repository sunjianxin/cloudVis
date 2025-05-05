import { Component } from '@angular/core';

import { HeaderComponent } from './header/header.component';
import { MapsComponent } from './maps/maps.component';
import { ViewGooglemapComponent } from './view-googlemap/view-googlemap.component';
import { ViewDeckglComponent } from './view-deckgl/view-deckgl.component';
import { ViewCesiumComponent } from "./view-cesium/view-cesium.component";
import { ViewLabelComponent } from "./view-label/view-label.component";
import { ViewAnimationComponent } from "./view-animation/view-animation.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, MapsComponent, ViewGooglemapComponent, ViewDeckglComponent, ViewCesiumComponent, ViewLabelComponent, ViewAnimationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  selectedMapId = 'DECK GL';

  get selectedMap() {
    return this.selectedMapId;
  }

  onSelectMap(id: string) {
    this.selectedMapId = id;
    console.log('app root received: ' + id);
  }
}
