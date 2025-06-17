import { Either } from 'fp-ts/Either';
import { DiseaseModel } from '../model/disease.model';

export interface DiseaseDatasourceRemote {

    getAllDiseases(): Promise<Either<Error, DiseaseModel[]>>

}
