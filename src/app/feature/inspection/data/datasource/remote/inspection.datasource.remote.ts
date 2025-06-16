import { Either } from 'fp-ts/Either';
import { InspectionResponseModel } from '../../models/inspectionResponseModel';
import { InspectionRequestModel } from '../../models/inspection.request.model';
import { InspectionDetailsModel } from '../../models/inspection.details.model';

export interface InspectionDatasourceRemote {

    postInspection(request: InspectionRequestModel): Promise<Either<Error, boolean>>

    getAllInspections(): Promise<Either<Error, InspectionResponseModel[]>>

    getInspectionByInspectionId(inspectionId: number): Promise<Either<Error, InspectionDetailsModel>>

}
