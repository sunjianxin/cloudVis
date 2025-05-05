import { Component, ElementRef, ViewChild, AfterViewInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Viewer, EllipsoidTerrainProvider, Rectangle, Entity, ImageMaterialProperty, Ion } from 'cesium';
import fetch from "node-fetch";
import { createCanvas, loadImage } from 'canvas';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-cesium',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-cesium.component.html',
  styleUrl: './view-cesium.component.css'
})
export class ViewCesiumComponent implements AfterViewInit {
  @ViewChild('cesiumContainer', { static: false }) cesiumContainer!: ElementRef;

  private viewer!: Viewer;
  private currentOverlayEntity: Entity | null = null; // Reference to the current overlay
  private currentURL = '../../assets/MSG3-SEVI-MSG15-0100-NA-20170102122740.989000000Z-NA_HRV_merc_color.png'

  private gt0: number[][] = [];
  private channel_gt0: number[] = [];
  private myArray: number[] = [10, 5, 8, 3, 20, 15];

  
  numbers: number[] = [1, 2, 3]; // Array for dropdown options
  selectedNumber_r: number = 1;   // Default selected number
  selectedNumber_g: number = 1;   // Default selected number
  selectedNumber_b: number = 1;   // Default selected number
  someParameter: string = 'Initial Value'; // Parameter to change

  channel_1: number[] = [];
  channel_2: number[] = [];
  channel_3: number[] = [];
  channel_r: number[] = [];
  channel_g: number[] = [];
  channel_b: number[] = [];
  imageLoaded: boolean = false;
  composedImageUrl: string = '';
  height: number = 1108;
  width: number = 1108;

  isCheckedl0 = true;
  isCheckedl1 = true;
  isCheckedl2 = true;
  isCheckedl3 = true;
  isCheckedl4 = true;
  isCheckedl5 = true;
  isCheckedl6 = true;
  isCheckedl7 = true;
  isCheckedl8 = true;
  isCheckedl9 = true;
  isCheckedl10 = true;

  // l0r : number = 0;
  // l0g : number = 0;
  // l0b : number = 0;
  // l0a : number = 0;

  // l1r : number = 255;
  // l1g : number = 0;
  // l1b : number = 0;
  // l1a : number = 150;

  // l2r : number = 255;
  // l2g : number = 127;
  // l2b : number = 0;
  // l2a : number = 150;

  // l3r : number = 255;
  // l3g : number = 255;
  // l3b : number = 0;
  // l3a : number = 150;

  // l4r : number = 128;
  // l4g : number = 255;
  // l4b : number = 0;
  // l4a : number = 150;

  // l5r : number = 0;
  // l5g : number = 255;
  // l5b : number = 0;
  // l5a : number = 150;

  // l6r : number = 0;
  // l6g : number = 255;
  // l6b : number = 255;
  // l6a : number = 150;

  // l7r : number = 0;
  // l7g : number = 127;
  // l7b : number = 255;
  // l7a : number = 150;

  // l8r : number = 0;
  // l8g : number = 0;
  // l8b : number = 255;
  // l8a : number = 150;

  // l9r : number = 75;
  // l9g : number = 0;
  // l9b : number = 130;
  // l9a : number = 150;

  // l10r : number = 143;
  // l10g : number = 0;
  // l10b : number = 255;
  // l10a : number = 150;

  // Cloud Cast Color Map
  l0r : number = 200;
  l0g : number = 200;
  l0b : number = 200;
  l0a : number = 150;

  l1r : number = 64;
  l1g : number = 64;
  l1b : number = 245;
  l1a : number = 150;

  l2r : number = 117;
  l2g : number = 251;
  l2b : number = 253;
  l2a : number = 150;

  l3r : number = 117;
  l3g : number = 251;
  l3b : number = 76;
  l3a : number = 150;

  l4r : number = 240;
  l4g : number = 152;
  l4b : number = 55;
  l4a : number = 150;

  l5r : number = 235;
  l5g : number = 81;
  l5b : number = 73;
  l5a : number = 150;

  l6r : number = 255;
  l6g : number = 255;
  l6b : number = 103;
  l6a : number = 150;

  l7r : number = 235;
  l7g : number = 81;
  l7b : number = 247;
  l7a : number = 150;

  l8r : number = 203;
  l8g : number = 135;
  l8b : number = 248;
  l8a : number = 150;

  l9r : number = 137;
  l9g : number = 61;
  l9b : number = 246;
  l9a : number = 150;

  l10r : number = 111;
  l10g : number = 75;
  l10b : number = 163;
  l10a : number = 150;

  number1: number = 0;
  number2: number = 0;
  number3: number = 0;

  validateInput(field: 'l0r' | 'l0g' | 'l0b' | 'l0a' |
                       'l1r' | 'l1g' | 'l1b' | 'l1a' |
                       'l2r' | 'l2g' | 'l2b' | 'l2a' |
                       'l3r' | 'l3g' | 'l3b' | 'l3a' |
                       'l4r' | 'l4g' | 'l4b' | 'l4a' |
                       'l5r' | 'l5g' | 'l5b' | 'l5a' |
                       'l6r' | 'l6g' | 'l6b' | 'l6a' |
                       'l7r' | 'l7g' | 'l7b' | 'l7a' |
                       'l8r' | 'l8g' | 'l8b' | 'l8a' |
                       'l9r' | 'l9g' | 'l9b' | 'l9a' |
                       'l10r' | 'l10g' | 'l10b' | 'l10a'): void {
    if (this[field] < 0) this[field] = 0;
    if (this[field] > 255) this[field] = 255;
  }

  onNumberChange(): void {
    this.someParameter = `Selected number is ${this.selectedNumber_r}`;
    console.log(this.someParameter); // For debugging


    if (this.currentOverlayEntity) {
      this.viewer.entities.remove(this.currentOverlayEntity);
      this.currentOverlayEntity = null;
    }

    if (this.selectedNumber_r == 1) {
      this.channel_r = this.channel_1;
    }
    if (this.selectedNumber_r == 2) {
      this.channel_r = this.channel_2;
    }
    if (this.selectedNumber_r == 3) {
      this.channel_r = this.channel_3;
    }
    if (this.selectedNumber_g == 1) {
      this.channel_g = this.channel_1;
    }
    if (this.selectedNumber_g == 2) {
      this.channel_g = this.channel_2;
    }
    if (this.selectedNumber_g == 3) {
      this.channel_g = this.channel_3;
    }
    if (this.selectedNumber_b == 1) {
      this.channel_b = this.channel_1;
    }
    if (this.selectedNumber_b == 2) {
      this.channel_b = this.channel_2;
    }
    if (this.selectedNumber_b == 3) {
      this.channel_b = this.channel_3;
    }
    
    const matrix = this.generateSampleMatrix();
    this.composedImageUrl = this.matrixToImage(matrix, this.width, this.height);

    // let currentURL = '../../assets/MSG3-SEVI-MSG15-0100-NA-20170102122740.989000000Z-NA_HRV_merc_grey.png'
    this.currentOverlayEntity = this.addImageOverlay(
      this.composedImageUrl,
      [-4.816534709314306, 42.05333657026676], // Bottom-left corner [longitude, latitude]
      [33.77742545811928, 60.15622631725923]  // Top-right corner [longitude, latitude]
    );

  }
  
  onClick() {
    console.log('Button clicked!');
    // Read the label as .json file
    this.http.get<number[][]>('assets/gt0.json').subscribe(
      (response) => {
        this.gt0 = response;
        console.log('Loaded data:', this.gt0);
        console.log(this.gt0);
        // Process the image data
        for (let i = 0; i < 768; i += 1) {
          for (let j = 0; j < 768; j += 1) {
            this.channel_gt0.push(this.gt0[i][j]);
          }
        };

        console.log("size 1:", this.gt0.length)
        console.log("size 2:", this.gt0[0].length)

        if (this.currentOverlayEntity) {
          this.viewer.entities.remove(this.currentOverlayEntity);
          this.currentOverlayEntity = null;
        }

        const matrix = this.generateSampleMatrixGT();
        this.composedImageUrl = this.matrixToImage(matrix, 768, 768);
        
        // let currentURL = '../../assets/MSG3-SEVI-MSG15-0100-NA-20170102122740.989000000Z-NA_HRV_merc_grey.png'
        this.currentOverlayEntity = this.addImageOverlay(
          this.composedImageUrl,
          [-4.816534709314306, 42.05333657026676], // Bottom-left corner [longitude, latitude]
          [33.77742545811928, 60.15622631725923]  // Top-right corner [longitude, latitude]
        );
      },
      (error) => {
        console.error('Error loading JSON file', error);
      }
    );
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Set the base URL for Cesium resources
    (window as any).CESIUM_BASE_URL = '/assets/cesium/';
    Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YTZiZTlkZi0yNmMxLTQ1ZjgtYTE1YS02ZmUyMjkzZDkxOTMiLCJpZCI6MjY2OTM5LCJpYXQiOjE3MzYxMjkwNzN9.QWvOiw3tH1hgPcwCis9wVVF4TjB2z0zzVawY2_lQ4PY'
  }

  ngAfterViewInit(): void {
    this.initializeCesium();
    
    // // Example matrix (W x H x 4)
    // const width = 256;
    // const height = 256;
    // const matrix = this.generateSampleMatrix(width, height);

    // // Convert the matrix to a Base64 image
    // const imageUrl = this.matrixToImage(matrix, width, height);

    // Add an image overlay
    // this.currentOverlayEntity = this.addImageOverlay(
    //   this.currentURL,
    //   [-4.816534709314306, 42.05333657026676], // Bottom-left corner [longitude, latitude]
    //   [33.77742545811928, 60.15622631725923]  // Top-right corner [longitude, latitude]
    // );

    this.processPngFile(this.currentURL);
    // this.channel_r = this.channel_1;
    // this.channel_g = this.channel_2;
    // this.channel_b = this.channel_3;
    // const matrix = this.generateSampleMatrix();
    // this.composedImageUrl = this.matrixToImage(matrix, this.width, this.height);

    // this.currentOverlayEntity = this.addImageOverlay(
    //   // '../../assets/MSG3-SEVI-MSG15-0100-NA-20170102122740.989000000Z-NA_HRV_merc_color.png', // Replace with your image URL
    //   this.composedImageUrl,
    //   [-4.816534709314306, 42.05333657026676], // Bottom-left corner [longitude, latitude]
    //   [33.77742545811928, 60.15622631725923]  // Top-right corner [longitude, latitude]
    // );

    

    
    

    
  }

  private initializeCesium(): void {
    if (!this.cesiumContainer?.nativeElement) {
      console.error('Cesium container element not found!');
      return;
    }

    this.viewer = new Viewer(this.cesiumContainer.nativeElement, {
      terrainProvider: new EllipsoidTerrainProvider(),
      animation: false,
      timeline: false,
      baseLayerPicker: true,
      geocoder: true,
      homeButton: true,
      sceneModePicker: true,
      navigationHelpButton: true,
      infoBox: true,
      selectionIndicator: true,
    });
  }

  // private addImageOverlay(imageUrl: string, bottomLeft: [number, number], topRight: [number, number]): void {
  //   const rectangle = Rectangle.fromDegrees(
  //     bottomLeft[0], // West longitude
  //     bottomLeft[1], // South latitude
  //     topRight[0],   // East longitude
  //     topRight[1]    // North latitude
  //   );

  //   this.viewer.entities.add(new Entity({
  //     name: 'Image Overlay',
  //     rectangle: {
  //       coordinates: rectangle,
  //       material: new ImageMaterialProperty({ image: imageUrl }),
  //     }
  //   }));

  //   // Adjust the viewer's view to fit the rectangle
  //   this.viewer.camera.flyTo({
  //     destination: rectangle
  //   });

  // }

  private addImageOverlay(imageUrl: string, bottomLeft: [number, number], topRight: [number, number]): Entity {
    const rectangle = Rectangle.fromDegrees(
      bottomLeft[0], // West longitude
      bottomLeft[1], // South latitude
      topRight[0],   // East longitude
      topRight[1]    // North latitude
    );
  
    const overlayEntity = new Entity({
      name: 'Image Overlay',
      rectangle: {
        coordinates: rectangle,
        material: new ImageMaterialProperty({ image: imageUrl }),
      }
    });
  
    this.viewer.entities.add(overlayEntity);
  
    // Adjust the viewer's view to fit the rectangle
    this.viewer.camera.flyTo({
      destination: rectangle
    });
  
    return overlayEntity; // Return the created entity
  }

  private processPngFile(imageUrl: string) {
    const img = new Image();
    img.src = imageUrl;
    img.crossOrigin = 'Anonymous'; // Avoid CORS issues for local testing with assets
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Canvas 2D context not available');
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      this.width = img.width;
      this.height = img.height;
      // console.log(img.width);
      // console.log(img.height);

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;

      // Process the image data
      for (let i = 0; i < data.length; i += 4) {
        this.channel_1.push(data[i]);     // Red
        this.channel_2.push(data[i + 1]); // Green
        this.channel_3.push(data[i + 2]); // Blue
        // Alpha channel is data[i + 3] if needed
      }

      this.imageLoaded = true;

      // console.log('R Channel:', this.channel_1);
      // console.log('G Channel:', this.channel_2);
      // console.log('B Channel:', this.channel_3);
    };

    img.onerror = () => {
      console.error('Failed to load the image from the predefined path.');
    };
  }


  private generateSampleMatrix(): Uint8ClampedArray {
    const matrix = new Uint8ClampedArray(this.width * this.height * 4);
    for (let i = 0; i < this.width * this.height; i++) {
      const offset = i * 4;
      matrix[offset] = this.channel_r[i]; // Red
      matrix[offset + 1] = this.channel_g[i]; // Green
      matrix[offset + 2] = this.channel_b[i]; // Blue
      matrix[offset + 3] = 100; // Alpha (fully opaque)
    }
    return matrix;
  }

  private generateSampleMatrixGT(): Uint8ClampedArray {
    const matrix = new Uint8ClampedArray(768 * 768 * 4);
    for (let i = 0; i < 768 * 768; i++) {
      const offset = i * 4;
      // Check the label of each pixel
      switch (this.channel_gt0[i]) {
        case 0:
          if (this.isCheckedl0) {
            matrix[offset] = this.l0r; // Red
            matrix[offset + 1] = this.l0g; // Green
            matrix[offset + 2] = this.l0b; // Blue
            matrix[offset + 3] = this.l0a; // Alpha (fully opaque)
          }
          break;
        case 1:
          if (this.isCheckedl1) {
            matrix[offset] = this.l1r; // Red
            matrix[offset + 1] = this.l1g; // Green
            matrix[offset + 2] = this.l1b; // Blue
            matrix[offset + 3] = this.l1a; // Alpha (fully opaque)
          }
          break;
        case 2:
          if (this.isCheckedl2) {
            matrix[offset] = this.l2r; // Red
            matrix[offset + 1] = this.l2g; // Green
            matrix[offset + 2] = this.l2b; // Blue
            matrix[offset + 3] = this.l2a; // Alpha (fully opaque)
          }
          break;
        case 3:
          if (this.isCheckedl3) {
            matrix[offset] = this.l3r; // Red
            matrix[offset + 1] = this.l3g; // Green
            matrix[offset + 2] = this.l3b; // Blue
            matrix[offset + 3] = this.l3a; // Alpha (fully opaque)
          }
          break;
        case 4:
          if (this.isCheckedl4) {
            matrix[offset] = this.l4r; // Red
            matrix[offset + 1] = this.l4g; // Green
            matrix[offset + 2] = this.l4b; // Blue
            matrix[offset + 3] = this.l4a; // Alpha (fully opaque)
          }
          break;
        case 5:
          if (this.isCheckedl5) {
            matrix[offset] = this.l5r; // Red
            matrix[offset + 1] = this.l5g; // Green
            matrix[offset + 2] = this.l5b; // Blue
            matrix[offset + 3] = this.l5a; // Alpha (fully opaque)
          }
          break;
        case 6:
          if (this.isCheckedl6) {
            matrix[offset] = this.l6r; // Red
            matrix[offset + 1] = this.l6g; // Green
            matrix[offset + 2] = this.l6b; // Blue
            matrix[offset + 3] = this.l6a; // Alpha (fully opaque)
          }
          break;
        case 7:
          if (this.isCheckedl7) {
            matrix[offset] = this.l7r; // Red
            matrix[offset + 1] = this.l7g; // Green
            matrix[offset + 2] = this.l7b; // Blue
            matrix[offset + 3] = this.l7a; // Alpha (fully opaque)
          }
          break;
        case 8:
          if (this.isCheckedl8) {
            matrix[offset] = this.l8r; // Red
            matrix[offset + 1] = this.l8g; // Green
            matrix[offset + 2] = this.l8b; // Blue
            matrix[offset + 3] = this.l8a; // Alpha (fully opaque)
          }
          break;
        case 9:
          if (this.isCheckedl9) {
            matrix[offset] = this.l9r; // Red
            matrix[offset + 1] = this.l9g; // Green
            matrix[offset + 2] = this.l9b; // Blue
            matrix[offset + 3] = this.l9a; // Alpha (fully opaque)
          }
          break;
        case 10:
          if (this.isCheckedl10) {
            matrix[offset] = this.l10r; // Red
            matrix[offset + 1] = this.l10g; // Green
            matrix[offset + 2] = this.l10b; // Blue
            matrix[offset + 3] = this.l10a; // Alpha (fully opaque)
          }
          break;
        default:
      }

      // matrix[offset] = this.channel_gt0[i]; // Red
      // matrix[offset + 1] = this.channel_gt0[i]; // Green
      // matrix[offset + 2] = this.channel_gt0[i]; // Blue
      // matrix[offset + 3] = 200; // Alpha (fully opaque)
    }
    return matrix;
  }

  private matrixToImage(matrix: Uint8ClampedArray, width: number, height: number): string {
    // console.log(width)
    // console.log(height)
    // Create a canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    // Get the 2D rendering context
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Create an ImageData object and put the matrix data
    const imageData = new ImageData(matrix, width, height);
    ctx.putImageData(imageData, 0, 0);

    // Convert the canvas to a Base64 image URL
    return canvas.toDataURL();
  }
  
}
