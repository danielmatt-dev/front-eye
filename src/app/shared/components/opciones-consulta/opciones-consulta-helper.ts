import { ValidatorHelper } from '../../utils/validator.helper';
import { OptionLabel } from '../../utils/data';

export class OpcionesConsultaHelper extends ValidatorHelper {

    validarRangoSeleccionado(option: OptionLabel | undefined, fechas: Date[]) {

        if (option?.value === -1 && fechas.length === 0) {
            this.showMessage({key: 'dateRangeNotSelected'})
            return false
        }

        return true
    }

}
