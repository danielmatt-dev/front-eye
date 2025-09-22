import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

/**
 * Fábrica de carga para los archivos de traducción de la aplicación.
 *
 * @description
 * Configura el cargador de traducciones para que utilice los archivos
 * de internacionalización ubicados en la carpeta `./assets/i18n/` con
 * extensión `.json`.  
 *
 * Esta función es utilizada por `TranslateModule` para inicializar el
 * mecanismo de traducción en Angular.
 *
 * @param http Cliente HTTP de Angular usado para obtener los archivos de traducción.
 * @returns Una instancia de {@link TranslateHttpLoader} configurada para cargar los archivos de i18n.
 *
 * @example
 * ```ts
 * TranslateModule.forRoot({
 *   loader: {
 *     provide: TranslateLoader,
 *     useFactory: HttpLoaderFactory,
 *     deps: [HttpClient]
 *   }
 * })
 * ```
 */

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
