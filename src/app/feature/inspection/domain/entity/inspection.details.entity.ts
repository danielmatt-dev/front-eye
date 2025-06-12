import { InspectionDetailsModel, InspectionImageModel } from '../../data/models/inspection.details.model';
import { InspectionResponseEntity } from './inspection.response.entity';
import { DiagnosticProbabilityEntity } from './inspection.request.entity';
import { PatientResponseEntity } from '../../../patient/domain/entity/patient.response.entity';

export class InspectionDetailsEntity extends InspectionDetailsModel {

    override inspection: InspectionResponseEntity = new InspectionResponseEntity()

    override patient: PatientResponseEntity = new PatientResponseEntity()

    override images: InspectionImageEntity[] = []

    override probabilities: DiagnosticProbabilityEntity[] = []

    override inspectionHistory: InspectionResponseEntity[] = []

}

export class InspectionImageEntity extends InspectionImageModel {}
