import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css'
})
export class MapsComponent {
  @Input({ required: true }) id!: string;
  @Input({ required: true }) avatar!: string;
  // @Input({ required: true }) name!: string;
  @Output() select = new EventEmitter<string>();

  // if (this.id == 'deckgl') {
  get imagePath() {
    return 'assets/maps/' + this.avatar;
  }

  onSelectMap() {
    console.log(this.id);
    this.select.emit(this.id);
  }

}
