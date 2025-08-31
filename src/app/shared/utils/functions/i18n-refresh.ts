import { TranslateService } from '@ngx-translate/core';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export function reloadOnLangChange(
    translate: TranslateService,
    destroyRef: DestroyRef,
    loader: () => void
) {

    loader(); // carga inicial

    translate.onLangChange
        .pipe(takeUntilDestroyed(destroyRef))
        .subscribe(loader); // recarga al cambiar idioma

}
