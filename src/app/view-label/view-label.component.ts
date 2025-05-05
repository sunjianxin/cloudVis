import { Component, ElementRef, ViewChild, AfterViewInit, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Viewer, EllipsoidTerrainProvider, Rectangle, Entity, ImageMaterialProperty, Ion, Math, Cartographic, } from 'cesium';
import { ScreenSpaceEventHandler, ScreenSpaceEventType, Cartesian2, Cartesian3,  CallbackProperty, PolygonHierarchy, Color} from 'cesium';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-label',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-label.component.html',
  styleUrl: './view-label.component.css'
})

export class ViewLabelComponent  implements OnInit, AfterViewInit {
  @ViewChild('cesiumContainer', { static: false }) cesiumContainer!: ElementRef;
  private viewer!: Viewer;
  private currentOverlayEntity: Entity | null = null; // Reference to the current overlay
  private currentURL = '../../assets/MSG3-SEVI-MSG15-0100-NA-20170102122740.989000000Z-NA_HRV_merc_color.png';
  

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

  // Add these properties to your component
  private handler!: ScreenSpaceEventHandler;
  private polygonVertices: Cartesian3[] = [];
  public savedPolygons: Cartesian3[][] = [];
  private polygonEntity: Entity | null = null;
  private isDragging = false;
  public savedCirrus: boolean[] = [];
  public savedStratus: boolean[] = [];
  public savedCumulus: boolean[] = [];

  // Define the list that determines the number of dropdowns
  // items = ['Option 1', 'Option 2', 'Option 3']; // Example list
  // Optional: Define options for the dropdown menus
  // dropdownOptions = ['Very Low Cloud',
  //                    'Low Cloud',
  //                    'Mid-Level Cloud',
  //                    'High Opaque Cloud', 
  //                    'Very High Opaque Cloud',
  //                    'Fractional Cloud',
  //                    'High Semi-Transparent Thin Cloud',
  //                    'High Semi-Transparent Moderately Thick Cloud',
  //                    'High Semi-Transparent Thick Cloud',
  //                    'High Semi-Transparent Above Low Or Medium Cloud'
  //                   ];

  colors = [
    Color.BLUE.withAlpha(0.5),
    Color.BLUE.withAlpha(0.5),
    Color.BLUE.withAlpha(0.5),
    Color.BLUE.withAlpha(0.5),
    Color.BLUE.withAlpha(0.5),
    // Add more colors as needed
  ];

  // List of radio button options
  // items_2 = [
  //   { value: 'option1', label: 'Cirrus' },
  //   { value: 'option2', label: 'Stratus' },
  //   { value: 'option3', label: 'Cumulus' }
  // ];

  public cirrusChecked: boolean = false;
  public stratusChecked: boolean = false;
  public cumulusChecked: boolean = false;

  selectedValue: string = '';

  public clickedCoordinates: { latitude: number; longitude: number } | null = null;
  

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
      // Set the base URL for Cesium resources
      (window as any).CESIUM_BASE_URL = '/assets/cesium/';
      Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YTZiZTlkZi0yNmMxLTQ1ZjgtYTE1YS02ZmUyMjkzZDkxOTMiLCJpZCI6MjY2OTM5LCJpYXQiOjE3MzYxMjkwNzN9.QWvOiw3tH1hgPcwCis9wVVF4TjB2z0zzVawY2_lQ4PY'
  }

  ngAfterViewInit(): void {
    console.log(this.colors[0]);
    this.initializeCesium();
    this.processPngFile(this.currentURL);

    this.channel_r = this.channel_1;
    this.channel_g = this.channel_2;
    this.channel_b = this.channel_3;
    const matrix = this.generateSampleMatrix();
    this.composedImageUrl = this.matrixToImage(matrix, this.width, this.height);

    this.currentOverlayEntity = this.addImageOverlay(
      // '../../assets/MSG3-SEVI-MSG15-0100-NA-20170102122740.989000000Z-NA_HRV_merc_color.png', // Replace with your image URL
      this.currentURL,
      [-4.816534709314306, 42.05333657026676], // Bottom-left corner [longitude, latitude]
      [33.77742545811928, 60.15622631725923]  // Top-right corner [longitude, latitude]
    );

    this.initializePolygonDrawing();
  }

  private initializePolygonDrawing(): void {
    this.handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);

    // Add a keydown event listener for the "Esc" key
    document.addEventListener('keydown', this.handleKeyDown.bind(this));

    // Capture left click events to add vertices and show coordinates
    this.handler.setInputAction((event: any) => {
      const position = this.viewer.camera.pickEllipsoid(event.position, this.viewer.scene.globe.ellipsoid);
      if (position) {
        // Add vertex to polygon
        this.polygonVertices.push(position);
        this.updatePolygon();

        // Convert Cartesian3 to geographic coordinates
        const cartographic = Cartographic.fromCartesian(position);
        const longitude = Math.toDegrees(cartographic.longitude);
        const latitude = Math.toDegrees(cartographic.latitude);

        // Update the clickedCoordinates property
        this.clickedCoordinates = { latitude, longitude };
        console.log(this.clickedCoordinates.latitude);
        console.log(this.clickedCoordinates.longitude);
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    // Capture left click events to add vertices
    // this.handler.setInputAction((event: any) => {
    //   const position = this.viewer.camera.pickEllipsoid(event.position, this.viewer.scene.globe.ellipsoid);
    //   if (position) {
    //     this.polygonVertices.push(position);
    //     this.updatePolygon();
    //   }
    // }, ScreenSpaceEventType.LEFT_CLICK);

    // Capture mouse movement to show a preview of the polygon
    this.handler.setInputAction((event: any) => {
      if (this.polygonVertices.length > 0) {
        const position = this.viewer.camera.pickEllipsoid(event.endPosition, this.viewer.scene.globe.ellipsoid);
        if (position) {
          this.updatePolygonPreview(position);
        }
      }
    }, ScreenSpaceEventType.MOUSE_MOVE);

    // Start dragging on LEFT_DOWN
    this.handler.setInputAction((event: any) => {
      if (this.polygonVertices.length > 0) {
        this.isDragging = true;
      }
    }, ScreenSpaceEventType.LEFT_DOWN);

    // Update vertex position while dragging
    this.handler.setInputAction((event: any) => {
      if (this.isDragging && this.polygonVertices.length > 0) {
        const position = this.viewer.camera.pickEllipsoid(event.endPosition, this.viewer.scene.globe.ellipsoid);
        if (position) {
          this.polygonVertices[this.polygonVertices.length - 1] = position;
          this.updatePolygon();
        }
      }
    }, ScreenSpaceEventType.MOUSE_MOVE);

    // Stop dragging on LEFT_UP
    this.handler.setInputAction(() => {
      this.isDragging = false;
    }, ScreenSpaceEventType.LEFT_UP);
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.resetPolygon();
    } else if (event.key === 's' || event.key === 'S') {
      this.savePolygon();
    }
  }

  private savePolygon(): void {
    if (this.polygonVertices.length > 0) {
      this.savedPolygons.push([...this.polygonVertices]);
      console.log('Polygon saved:', this.polygonVertices);
      alert('Polygon saved successfully!');
      this.renderSavedPolygons(); // Render the saved polygons
      this.savedCirrus.push(this.cirrusChecked);
      this.savedStratus.push(this.stratusChecked);
      this.savedCumulus.push(this.cumulusChecked);
      console.log(this.savedCirrus);
      console.log(this.savedStratus);
      console.log(this.savedCumulus);
    } else {
      alert('No polygon to save.');
    }
  }

  // private renderSavedPolygons(): void {
  //   this.savedPolygons.forEach((vertices, index) => {
  //     const polygonEntity = new Entity({
  //       polygon: {
  //         hierarchy: new CallbackProperty(() => new PolygonHierarchy(vertices), false),
  //         material: Color.BLUE.withAlpha(0.5), // Use a different color for saved polygons
  //         outline: true,
  //         outlineColor: Color.BLACK,
  //       },
  //     });
  //     this.viewer.entities.add(polygonEntity);
  //   });
  // }

  private renderSavedPolygons(): void {
    // Remove all existing polygon entities from the viewer
    this.viewer.entities.values.forEach(entity => {
      if (entity.polygon) {
        this.viewer.entities.remove(entity);
      }
    });

    this.savedPolygons.forEach((vertices, index) => {
      // Get the corresponding color for this polygon
      console.log("drawing polygon: ", index);
      const polygonColor = { r: 0, g: 0, b: 0, a: 0.5 };
      if (this.savedCirrus[index]) {
        polygonColor.r = 255;
      }
      if (this.savedStratus[index]) {
        polygonColor.g = 255;
      }
      if (this.savedCumulus[index]) {
        polygonColor.b = 255;
      }
      // Convert to Cesium color
      const cesiumColor = Color.fromBytes(
        polygonColor.r,
        polygonColor.g,
        polygonColor.b,
        polygonColor.a * 255
      );
      // const polygonColor = this.colors[index % this.colors.length]; // Use modulo to handle cases where colors.length < savedPolygons.length
  
      const polygonEntity = new Entity({
        polygon: {
          hierarchy: new CallbackProperty(() => new PolygonHierarchy(vertices), false),
          // material: polygonColor, // Use the corresponding color
          material: cesiumColor, // Use the corresponding color
          outline: true,
          outlineColor: Color.BLACK,
        },
      });
      this.viewer.entities.add(polygonEntity);
    });
  }
  

  // private initializePolygonDrawing(): void {
  //   this.handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);
  
  //   // Capture left click events
  //   this.handler.setInputAction((event: any) => {
  //     const position = this.viewer.camera.pickEllipsoid(event.position, this.viewer.scene.globe.ellipsoid);
  //     if (position) {
  //       this.polygonVertices.push(position);
  //       this.updatePolygon();
  //     }
  //   }, ScreenSpaceEventType.LEFT_CLICK);
  
  //   // Optionally, capture mouse movement to show a preview of the polygon
  //   this.handler.setInputAction((event: any) => {
  //     if (this.polygonVertices.length > 0) {
  //       const position = this.viewer.camera.pickEllipsoid(event.endPosition, this.viewer.scene.globe.ellipsoid);
  //       if (position) {
  //         this.updatePolygonPreview(position);
  //       }
  //     }
  //   }, ScreenSpaceEventType.MOUSE_MOVE);
  // }

  private updatePolygon(): void {
    if (this.polygonEntity) {
      this.viewer.entities.remove(this.polygonEntity);
    }
  
    if (this.polygonVertices.length > 2) {
      this.polygonEntity = new Entity({
        polygon: {
          hierarchy: new CallbackProperty(() => new PolygonHierarchy(this.polygonVertices), false),
          material: Color.BLUE.withAlpha(0.5),
          outline: true,
          outlineColor: Color.BLUE,
        },
      });
  
      this.viewer.entities.add(this.polygonEntity);
    }
  }
  
  private updatePolygonPreview(position: Cartesian3): void {
    if (this.polygonVertices.length > 0) {
      const previewVertices = [...this.polygonVertices, position];
      if (this.polygonEntity) {
        this.viewer.entities.remove(this.polygonEntity);
      }
  
      this.polygonEntity = new Entity({
        polygon: {
          hierarchy: new CallbackProperty(() => new PolygonHierarchy(previewVertices), false),
          material: Color.BLUE.withAlpha(0.5),
          outline: true,
          outlineColor: Color.BLUE,
        },
      });
  
      this.viewer.entities.add(this.polygonEntity);
    }
  }

  public resetPolygon(): void {
    if (this.polygonEntity) {
      this.viewer.entities.remove(this.polygonEntity);
      this.polygonEntity = null;
    }
    this.polygonVertices = [];
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

  public zoomIn(): void {
    if (!this.viewer) return;
    
    // Get current camera position and zoom in by 50%
    const camera = this.viewer.camera;
    const moveAmount = camera.positionCartographic.height * 0.2; // Zoom in by 50%
    const newHeight = camera.positionCartographic.height - moveAmount;
    
    // Don't zoom in too close (minimum height of 1000 meters)
    if (newHeight > 1000) {
      camera.zoomIn(moveAmount);
    }
  }
  
  public zoomOut(): void {
    if (!this.viewer) return;
    
    // Get current camera position and zoom out by 50%
    const camera = this.viewer.camera;
    const moveAmount = camera.positionCartographic.height * 0.2; // Zoom out by 50%
    camera.zoomOut(moveAmount);
  }

  public onCheckboxChange(): void {
    console.log('Checkbox states:', {
      cirrus: this.cirrusChecked,
      stratus: this.stratusChecked,
      cumulus: this.cumulusChecked
    });
    // Add your logic here for when checkboxes change
  }

}
