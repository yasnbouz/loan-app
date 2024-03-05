import { IcompanyType, createSchema } from "@/components/registration/validation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TextField } from "@/components/ui/form";
import { action } from "@/routes/registration";
import { useForm, getInputProps, getFormProps } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form, useActionData, useNavigation, useSearchParams } from "@remix-run/react";
import { useEffect } from "react";

export function StepTwo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const companyType = (searchParams.get("companyType") || "autonomo") as IcompanyType;

  const lastResult = useActionData<typeof action>() as any;
  const IsStepTwoDone = lastResult?.stepTwo === true;

  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === `/registration?step=2&companyType=${companyType}&id=${searchParams.get("id")}`;

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createSchema(companyType) });
    },
  });
  useEffect(() => {
    if (IsStepTwoDone) {
      setSearchParams((prev) => {
        prev.delete("companyType");
        prev.delete("id");
        prev.set("step", "3");
        return prev;
      });
    }
  }, [IsStepTwoDone]);

  return (
    <Card className="w-11/12">
      <Form {...getFormProps(form)} method="POST" encType="multipart/form-data">
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Fill your business information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TextField
            labelProps={{ children: "Tarjeta de identificación fiscal" }}
            inputProps={{ ...getInputProps(fields.trajetaFiscal, { type: "file" }) }}
            errors={fields.trajetaFiscal.errors}
          />
          <TextField
            labelProps={{ children: "Certificado de situacion censal" }}
            inputProps={{ ...getInputProps(fields.certificadoCensal, { type: "file" }) }}
            errors={fields.certificadoCensal.errors}
          />
          <TextField labelProps={{ children: "Modelo 036" }} inputProps={{ ...getInputProps(fields.modelo036, { type: "file" }) }} errors={fields.modelo036.errors} />
          {companyType === "autonomo" ? (
            <TextField labelProps={{ children: "Modelo 037" }} inputProps={{ ...getInputProps(fields.modelo037, { type: "file" }) }} errors={fields.modelo037.errors} />
          ) : null}
          {companyType === "sociedad" ? (
            <TextField
              labelProps={{ children: "Escritura de la empresa" }}
              inputProps={{ ...getInputProps(fields.escrituraEmpresa, { type: "file" }) }}
              errors={fields.escrituraEmpresa.errors}
            />
          ) : null}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button disabled={isSubmitting} type="submit" name="intent" value={"stepTwo"} variant={"outline"}>
            {isSubmitting ? "Next..." : "Next"}
          </Button>
        </CardFooter>
      </Form>
    </Card>
  );
}
