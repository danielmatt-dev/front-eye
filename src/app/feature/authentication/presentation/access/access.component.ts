import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { TranslatePipe } from '@ngx-translate/core';
import { NgOptimizedImage } from '@angular/common';
import { RoleRedirectService } from '../../../../shared/services/role.redirect.service';

@Component({
    selector: 'app-access',
    standalone: true,
    imports: [ButtonModule, RouterModule, RippleModule, AppFloatingConfigurator, ButtonModule, TranslatePipe, NgOptimizedImage],
    templateUrl: './access.component.html'
})
export class AccessComponent {

    constructor(
        private readonly roleRedirect: RoleRedirectService
    ) {}

    async redirect() {
        await this.roleRedirect.redirectByRole()
    }

}
