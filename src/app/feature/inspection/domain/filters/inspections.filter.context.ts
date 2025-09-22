import { InspectionsFilterStrategy } from './inspections.filter';
import { ChartData } from 'chart.js';
import { InspectionResponseModel } from '../../data/models/inspection.response.model';
import { Injectable } from '@angular/core';
import { TranslateLang } from '../../../../shared/utils/functions/translate-lang';

/**
 * Contexto para aplicar estrategias de filtrado sobre las inspecciones.
 *
 * @description
 * Esta clase implementa el **Patrón Strategy**, delegando la lógica de filtrado
 * y transformación de datos a la estrategia proporcionada.
 * 
 * Su propósito es desacoplar la lógica de generación de datos para gráficas
 * del componente que las consume, permitiendo cambiar dinámicamente la
 * estrategia de filtrado (por enfermedad, por género, por resultado, etc.).
 */
@Injectable({ providedIn: 'root' })
export class InspectionsFilterContext {
    /**
  * @param translateLang Servicio de traducción que permite
  * internacionalizar etiquetas y textos en los datos de salida.
  */
    constructor(
        private readonly translateLang: TranslateLang
    ) { }

    /**
 * Aplica la estrategia de filtrado proporcionada sobre la lista de inspecciones.
 *
 * @param data Lista de inspecciones que se desean filtrar o agrupar.
 * @param strategy Estrategia de filtrado que define cómo se procesarán los datos.
 * @returns Datos en formato {@link ChartData} listos para ser usados en gráficas.
 *
 * @example
 * ```ts
 * const context = new InspectionsFilterContext(translateLang);
 * const chartData = context.apply(inspections, new FilterByDiseaseStrategy());
 * ```
 */
    apply(data: InspectionResponseModel[], strategy: InspectionsFilterStrategy): ChartData {
        strategy.setTranslateLang(this.translateLang)
        return strategy.getChartData(data);
    }

}
