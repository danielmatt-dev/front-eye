import { AiModelModel } from '../model/aimodel.model';
import { Either } from 'fp-ts/Either';

export interface AimodelDatasourceRemote {

    getAllModels(): Promise<Either<Error, AiModelModel[]>>

}
