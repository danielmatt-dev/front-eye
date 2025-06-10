import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { TranslatePipe } from '@ngx-translate/core';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { LocalStorageService } from '../../../../shared/services/local.storage.service';

@Component({
    selector: 'app-login',
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, TranslatePipe, AppFloatingConfigurator],
    templateUrl: './login.component.html',
    standalone: true,
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    email: string = '';

    password: string = '';

    checked: boolean = false;

    constructor(
        private readonly local: LocalStorageService,
        private readonly router: Router
    ) {}

    async redirigir() {
        //const userRole = this.local.getRole()
        let userRole = 'ADMIN';

        this.email = this.email.toLowerCase();
        if (this.email.includes('doctor')) {
            this.local.setRole('DOCTOR');
        } else {
            this.local.setRole('ADMIN');
        }

        if (userRole === 'ADMIN') {
            await this.router.navigate(['/insights/dashboard'], { replaceUrl: true });
        }

        if (userRole === 'DOCTOR') {
            await this.router.navigate(['/insights/nueva-inspeccion'], { replaceUrl: true });
        }
    }
}
