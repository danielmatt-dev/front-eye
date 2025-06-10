import { ClinicModel } from '../../data/models/clinic.model';

export class ClinicEntity extends ClinicModel {

    constructor(options: {
        clinicId?: number
        name?: string
        description?: string
    } = {}) {
        super({
            clinicId: options.clinicId,
            name: options.name,
            description: options.description
        });
    }

}
