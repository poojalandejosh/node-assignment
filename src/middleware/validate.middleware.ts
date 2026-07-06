import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

const validateBody =
  (schema: ZodType<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "validation error",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }
    req.body = result.data;
    next();
  };

export default validateBody;
