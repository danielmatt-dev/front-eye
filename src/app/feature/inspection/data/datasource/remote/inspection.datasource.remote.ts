import { Either } from 'fp-ts/Either';
import { InspectionReponseModel } from '../../models/inspection.reponse.model';

export interface InspectionDatasourceRemote {

    getAllInspections(): Promise<Either<Error, InspectionReponseModel[]>>

}
