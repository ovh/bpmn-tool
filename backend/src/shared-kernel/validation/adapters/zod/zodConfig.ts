import { z } from 'zod';

export const zodConfigurator = () => {
  const customErrorMap: z.ZodErrorMap = (issue, _ctx) => ({
    message:
      (issue.path.length ? `${issue.path.join('.')}: ` : '') +
      _ctx.defaultError,
  });

  z.setErrorMap(customErrorMap);
};
