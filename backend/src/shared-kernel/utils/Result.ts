export type FailedResult<Error> = {
  ok: null;
  fail: Error;
};

export type SuccessResult<Success> = {
  ok: Success;
  fail: null;
};

export const isSuccess = (
  result: Result<unknown, unknown>,
): result is SuccessResult<unknown> => result.ok !== null;

export type Result<Success, Error> =
  | FailedResult<Error>
  | SuccessResult<Success>;

export const ok = <Success>(success: Success): SuccessResult<Success> => ({
  ok: success,
  fail: null,
});

export const fail = <Error>(error: Error): FailedResult<Error> => ({
  ok: null,
  fail: error,
});

export const combineResults = <T, E>(resultList: Result<T, E>[]) =>
  resultList.reduce<Result<T[], E[]>>((acc, currentValue) => {
    if (currentValue.ok) {
      if (acc.ok) {
        return ok([...acc.ok, currentValue.ok]);
      } else {
        return ok([currentValue.ok]);
      }
    } else if (currentValue.fail) {
      if (acc.ok) {
        return fail([currentValue.fail]);
      } else {
        return fail([...acc.fail, currentValue.fail]);
      }
    }

    throw new Error('Should not happen');
  }, ok([]));
