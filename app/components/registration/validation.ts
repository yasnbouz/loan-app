import { z } from "zod";

export type IcompanyType = "autonomo" | "sociedad";
const fileSizeMessage = { message: "File size exceeds the maximum limit 5 MB" };

export const schemaStepOne = z.object({
  idCardOrPass: z.instanceof(File, { message: "required" }).refine((val) => val.size < 5_000_000, fileSizeMessage),
  idCardOrPassWithSelfie: z.instanceof(File, { message: "required" }).refine((val) => val.size < 5_000_000, fileSizeMessage),
  CompanyType: z.enum(["autonomo", "sociedad"], { required_error: "required" }),
});

export function createSchema(companyType: IcompanyType) {
  if (companyType === "autonomo") {
    return z.object({
      trajetaFiscal: z.instanceof(File, { message: "required" }).refine((val) => val.size < 5_000_000, fileSizeMessage),
      certificadoCensal: z.instanceof(File, { message: "required" }).refine((val) => val.size < 5_000_000, fileSizeMessage),
      modelo037: z.instanceof(File, { message: "required" }).refine((val) => val.size < 5_000_000, fileSizeMessage),
    });
  }
  return z.object({
    trajetaFiscal: z.instanceof(File, { message: "required" }).refine((val) => val.size < 5_000_000, fileSizeMessage),
    certificadoCensal: z.instanceof(File, { message: "required" }).refine((val) => val.size < 5_000_000, fileSizeMessage),
    modelo036: z.instanceof(File, { message: "required" }).refine((val) => val.size < 5_000_000, fileSizeMessage),
    escrituraEmpresa: z.instanceof(File, { message: "required" }).refine((val) => val.size < 5_000_000, fileSizeMessage),
  });
}

export const schemaStepThree = z.object({ iban: z.string() });
