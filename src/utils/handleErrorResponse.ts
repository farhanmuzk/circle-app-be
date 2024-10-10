import { Response } from "express";

export const handleErrorResponse = (res: Response, error: any, message: string = "An error occurred", statusCode: number = 500) => {
  const errorMessage = error instanceof Error ? error.message : message;
  res.status(statusCode).json({ error: errorMessage });
};
