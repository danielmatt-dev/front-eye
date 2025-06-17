import { Either } from 'fp-ts/Either';
import { InspectionResponseModel } from '../../models/inspection.response.model';
import { InspectionRequestModel } from '../../models/inspection.request.model';
import { InspectionDetailsModel } from '../../models/inspection.details.model';
import { NewInspectionDataModel } from '../../models/new.inspection.data.model';

export interface InspectionDatasourceRemote {

    postInspection(request: InspectionRequestModel): Promise<Either<Error, boolean>>

    getAllInspections(): Promise<Either<Error, InspectionResponseModel[]>>

    getInspectionByInspectionId(inspectionId: number): Promise<Either<Error, InspectionDetailsModel>>

    getDataNewInspection(): Promise<Either<Error, NewInspectionDataModel>>

}
