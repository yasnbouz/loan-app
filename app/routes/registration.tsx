import { Form, useActionData, useNavigation, useSearchParams } from "@remix-run/react";
import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  redirect,
  json,
  unstable_parseMultipartFormData,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  MaxPartSizeExceededError,
} from "@remix-run/node";
import { useEffect } from "react";
import Layout from "@/components/shared/layout";
import { createClient } from "@/.server/supabase";
import Stepper, { IStep } from "@/components/stepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorMessage, Label, TextField } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { getFormProps, getInputProps, useForm, useInputControl } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { nanoid } from "nanoid";

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase, headers } = createClient(request);
  // check the session before register
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return redirect("/login", { headers });
  }

  return null;
}

async function asyncIterableToStream(asyncIterable: AsyncIterable<Uint8Array>, filename: string, contentType: string) {
  const chunks = [];
  const maxFileSize = 5_000_000;
  let size = 0;
  for await (const chunk of asyncIterable) {
    size += chunk.byteLength;
    if (size > maxFileSize) {
      throw new MaxPartSizeExceededError(filename, maxFileSize);
    }
    chunks.push(chunk);
  }
  const file = new File(chunks, filename, { type: contentType });

  return file.stream();
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { supabase, headers } = createClient(request);

  // check user session
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  if (!session) {
    redirect("/login", { headers });
  }

  // supabase upload handler
  const uploadHandler = unstable_composeUploadHandlers(async (file) => {
    if (!file.filename) {
      return undefined;
    }
    const stream = await asyncIterableToStream(file.data, file.filename, file.contentType);
    const id = nanoid();
    // upload to supabase
    const { data, error } = await supabase.storage.from("business-documents").upload(`${session?.user.id}/${id}-${file.filename}`, stream, { contentType: file.contentType });
    if (error) {
      throw error;
    }
    return data?.path;
  }, unstable_createMemoryUploadHandler());
  // get form data from client
  const formData = await unstable_parseMultipartFormData(request, uploadHandler);
  let businessId;
  const intent = formData.get("intent");
  switch (intent) {
    case "stepOne":
      const idCardOrPassPath = formData.get("idCardOrPass");
      const idCardOrPassWithSelfiePath = formData.get("idCardOrPassWithSelfie");
      const companyType = formData.get("CompanyType");

      if (idCardOrPassPath && idCardOrPassWithSelfiePath && companyType) {
        const { error, data } = await supabase.from("companies").insert({ user_id: session?.user.id, idCardOrPassPath, idCardOrPassWithSelfiePath, companyType }).select();
        if (error) throw error;
        return json({ stepOne: true, id: data?.[0]?.id });
      }
      break;
    case "stepTwo":
      const url = new URL(request.url);

      const businessID = url.searchParams.get("id");
      const trajetaFiscal = formData.get("trajetaFiscal");
      const certificadoCensal = formData.get("certificadoCensal");
      const modelo036 = formData.get("modelo036");
      const modelo037 = formData.get("modelo037");
      const escrituraEmpresa = formData.get("escrituraEmpresa");
      const { error } = await supabase.from("companies").update({ trajetaFiscal, certificadoCensal, modelo036, modelo037, escrituraEmpresa }).eq("id", businessID);

      if (error) throw error;
      return json({ stepTwo: true });
  }

  return null;
}
const steps: IStep[] = [{ name: "Step 1" }, { name: "Step 2" }, { name: "Step 3" }];

export default function Join() {
  const [searchParams] = useSearchParams();
  const stepParam = searchParams.get("step");
  const currentStep = Math.max(Number(stepParam), 1);

  /****** HANDLE STEPS***** */
  const isLastStep = currentStep === steps.length + 1;

  let renderSteps;
  switch (currentStep) {
    case 1:
      renderSteps = <StepOne />;
      break;
    case 2:
      renderSteps = <StepTwo />;
      break;
    case 3:
      renderSteps = <StepThree />;
      break;
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <div className="flex flex-col items-center gap-y-20">
          <Stepper steps={steps} currentStep={currentStep} />
          {renderSteps}
        </div>
      </div>
    </Layout>
  );
}

const fileSizeMessage = { message: "File size exceeds the maximum limit 5 MB" };

const schemaStepOne = z.object({
  idCardOrPass: z.instanceof(File, { message: "required" }).refine((val) => val.size < 5_000_000, fileSizeMessage),
  idCardOrPassWithSelfie: z.instanceof(File, { message: "required" }).refine((val) => val.size < 5_000_000, fileSizeMessage),
  CompanyType: z.enum(["autonomo", "sociedad"], { required_error: "required" }),
});

function StepOne() {
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
type IcompanyType = "autonomo" | "sociedad";

function createSchema(companyType: IcompanyType) {
  if (companyType === "autonomo") {
    return z.object({
      trajetaFiscal: z.instanceof(File, { message: "required" }).refine((val) => val.size < 5_000_000, fileSizeMessage),
      certificadoCensal: z.instanceof(File, { message: "required" }).refine((val) => val.size < 5_000_000, fileSizeMessage),
      modelo036: z.instanceof(File, { message: "required" }).refine((val) => val.size < 5_000_000, fileSizeMessage),
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
function StepTwo() {
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
function StepThree() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Information</CardTitle>
        <CardDescription>Fill your bank information</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter className="flex justify-between gap-x-2">
        <Button type="submit">Submit</Button>
      </CardFooter>
    </Card>
  );
}
