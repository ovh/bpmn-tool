import { Result } from '../../../shared-kernel/utils/Result';

export type UseCaseResult<IResponse> = Result<IResponse, Error>;

export interface UseCase<IRequest, IResponse> {
  execute(
    request?: IRequest,
  ): Promise<UseCaseResult<IResponse>> | UseCaseResult<IResponse>;
}
