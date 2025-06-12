import { DiagnosticProbabilityModel, InspectionRequestModel } from '../../data/models/inspection.request.model';

export class InspectionRequestEntity extends InspectionRequestModel {

    override probabilities: DiagnosticProbabilityEntity[] = [];

}

export class DiagnosticProbabilityEntity extends DiagnosticProbabilityModel{}
