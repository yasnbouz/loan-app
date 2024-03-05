import { schemaStepOne } from "@/components/registration/validation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorMessage, Label, TextField } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { action } from "@/routes/registration";
import { getFormProps, useForm, useInputControl, getInputProps } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form, useActionData, useNavigation, useSearchParams } from "@remix-run/react";
import { useEffect } from "react";

export function StepOne() {
  const [, setSearchParams] = useSearchParams();
  const lastResult = useActionData<typeof action>() as any;
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: schemaStepOne });
    },
  });
  const companyID = lastResult?.id;
  const companyType = useInputControl(fields.CompanyType);
  const IsStepOneDone = lastResult?.stepOne === true;

  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/registration" || navigation.formAction === "/registration?step=1";

  useEffect(() => {
    if (IsStepOneDone) {
      setSearchParams((prev) => {
        prev.set("step", "2");
        prev.set("companyType", `${companyType.value}`);
        prev.set("id", companyID);
        return prev;
      });
    }
  }, [IsStepOneDone]);
  return (
    <Card className="w-11/12">
      <Form {...getFormProps(form)} method="POST" encType="multipart/form-data">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Fill your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TextField labelProps={{ children: "ID Card/Passport" }} inputProps={{ ...getInputProps(fields.idCardOrPass, { type: "file" }) }} errors={fields.idCardOrPass.errors} />
          <TextField
            labelProps={{ children: "ID Card/Passport With Selfie" }}
            inputProps={{ ...getInputProps(fields.idCardOrPassWithSelfie, { type: "file" }) }}
            errors={fields.idCardOrPassWithSelfie.errors}
          />
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor={fields.CompanyType.id}>Type Of Company</Label>
              <ErrorMessage className="inline-block">{fields.CompanyType.errors}</ErrorMessage>
            </div>
            <Select name={fields.CompanyType.name} value={companyType.value} onValueChange={companyType.change}>
              <SelectTrigger id={fields.CompanyType.id} className="data-[placeholder]:text-muted-foreground">
                <SelectValue placeholder="Por favor, seleccione o busque con palabras clave." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="autonomo">Autonomo/Sole Traders</SelectItem>
                <SelectItem value="sociedad">Sociedad Limitada/Company</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button disabled={isSubmitting} type="submit" name="intent" value={"stepOne"} variant={"outline"}>
            {isSubmitting ? "Next..." : "Next"}
          </Button>
        </CardFooter>
      </Form>
    </Card>
  );
}
