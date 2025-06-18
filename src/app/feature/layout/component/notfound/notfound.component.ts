import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from '../app.floatingconfigurator';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-notfound',
    standalone: true,
    imports: [RouterModule, AppFloatingConfigurator, ButtonModule, TranslatePipe],
    templateUrl: './notfound.component.html'
})
export class NotfoundComponent {}
