import { Either } from 'fp-ts/Either';
import { InspectionRequestModel } from '../../models/inspection.request.model';
import { InspectionDetailsModel } from '../../models/inspection.details.model';
import { NewInspectionDataModel } from '../../models/new.inspection.data.model';
import { InspectionsWithDiseasesModel } from '../../models/inspections-with-diseases.model';
import { InspectionResponseModel } from '../../models/inspection.response.model';

export interface InspectionDatasourceRemote {

    postInspection(request: InspectionRequestModel): Promise<Either<Error, InspectionResponseModel>>

    getAllInspections(): Promise<Either<Error, InspectionsWithDiseasesModel>>

    getInspectionByInspectionId(inspectionId: number): Promise<Either<Error, InspectionDetailsModel>>

    getDataNewInspection(): Promise<Either<Error, NewInspectionDataModel>>

}
