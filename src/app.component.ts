import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import 'leaflet';
import 'leaflet.markercluster';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterModule,
        TranslateModule,
    ],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent {}
