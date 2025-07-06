import { ValidatorHelper } from '../../utils/validator.helper';

export class OpcionesConsultaHelper extends ValidatorHelper {

    validarRangoSeleccionado(rango: string, fechas: Date[]) {

        if (rango === 'Personalizado' && fechas.length === 0) {
            this.showMessage({key: 'dateRangeNotSelected'})
            return false
        }

        return true
    }

}
