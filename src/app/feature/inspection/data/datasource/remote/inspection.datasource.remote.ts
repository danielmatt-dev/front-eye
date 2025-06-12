import { Either } from 'fp-ts/Either';
import { InspectionReponseModel } from '../../models/inspection.reponse.model';
import { InspectionRequestModel } from '../../models/inspection.request.model';
import { InspectionDetailsModel } from '../../models/inspection.details.model';

export interface InspectionDatasourceRemote {

    postInspection(request: InspectionRequestModel): Promise<Either<Error, boolean>>

    getAllInspections(): Promise<Either<Error, InspectionReponseModel[]>>

    getInspectionByInspectionId(inspectionId: number): Promise<Either<Error, InspectionDetailsModel>>

}
