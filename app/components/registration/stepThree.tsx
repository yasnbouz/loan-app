import { schemaStepThree } from "@/components/registration/validation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TextField } from "@/components/ui/form";
import { action } from "@/routes/registration";
import { getFormProps, useForm, getInputProps } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form, useActionData, useNavigation, useSearchParams } from "@remix-run/react";
import { useEffect } from "react";

export function StepThree() {
  const [, setSearchParams] = useSearchParams();
  const lastResult = useActionData<typeof action>() as any;

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: schemaStepThree });
    },
  });
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/registration?step=3";

  const IsStepThreeDone = lastResult?.stepThree === true;

  useEffect(() => {
    if (IsStepThreeDone) {
      setSearchParams((prev) => {
        prev.set("step", "4");
        return prev;
      });
    }
  }, [IsStepThreeDone, setSearchParams]);

  return (
    <Card className="w-11/12">
      <Form {...getFormProps(form)} method="POST" encType="multipart/form-data">
        <CardHeader>
          <CardTitle>Bank Information</CardTitle>
          <CardDescription>Fill your bank information</CardDescription>
        </CardHeader>
        <CardContent>
          <TextField labelProps={{ children: "Bank Info" }} inputProps={{ ...getInputProps(fields.iban, { type: "text" }) }} errors={fields.iban.errors} />
        </CardContent>
        <CardFooter className="flex justify-between gap-x-2">
          <Button disabled={isSubmitting} type="submit" name="intent" value={"stepThree"} variant={"outline"}>
            {isSubmitting ? "Finish..." : "Finish"}
          </Button>
        </CardFooter>
      </Form>
    </Card>
  );
}
