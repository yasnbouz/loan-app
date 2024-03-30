import { useSearchParams } from "@remix-run/react";
import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  unstable_parseMultipartFormData,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  redirect,
} from "@remix-run/node";
import Layout from "@/components/shared/layout";
import { createClient } from "@/.server/supabase";
import Stepper, { IStep } from "@/components/stepper";
import { nanoid } from "nanoid";
import { asyncIterableToStream } from "@/lib/iterableToStream";
import { StepOne } from "@/components/registration/stepOne";
import { StepTwo } from "@/components/registration/stepTwo";
import { Success } from "@/components/registration/success";
import { checkSession } from "@/lib/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  return await checkSession(request);
}

export async function action({ request }: ActionFunctionArgs) {
  const { supabase } = createClient(request);

  const session = await checkSession(request);
  const user_id = String(session?.user?.id);

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
  const intent = formData.get("intent");
  switch (intent) {
    case "stepOne": {
      const idCardOrPassPath = String(formData.get("idCardOrPass"));
      const idCardOrPassWithSelfiePath = String(formData.get("idCardOrPassWithSelfie"));
      const companyType = String(formData.get("CompanyType"));

      if (idCardOrPassPath && idCardOrPassWithSelfiePath && companyType) {
        const { error } = await supabase.from("business").upsert({ user_id, idCardOrPassPath, idCardOrPassWithSelfiePath, companyType }, { onConflict: "user_id" }).select();
        if (error) throw error;
        return redirect(`/registration?step=2&company-type=${companyType}`);
      }
      break;
    }
    case "stepTwo": {
      const trajetaFiscal = String(formData.get("trajetaFiscal"));
      const certificadoCensal = String(formData.get("certificadoCensal"));
      const modelo036 = String(formData.get("modelo036"));
      const modelo037 = String(formData.get("modelo037"));
      const escrituraEmpresa = String(formData.get("escrituraEmpresa"));

      const { error } = await supabase
        .from("business")
        .upsert({ user_id, trajetaFiscal, certificadoCensal, modelo036, modelo037, escrituraEmpresa }, { onConflict: "user_id" })
        .select();

      if (error) throw error;
      return redirect("/registration?step=3");
    }
  }

  return null;
}
const steps: IStep[] = [{ name: "Step 1" }, { name: "Step 2" }];

export default function Join() {
  const [searchParams] = useSearchParams();
  const stepParam = searchParams.get("step");
  const currentStep = Math.max(Number(stepParam), 1);

  /****** HANDLE STEPS***** */

  let renderSteps;
  switch (currentStep) {
    case 1:
      renderSteps = <StepOne />;
      break;
    case 2:
      renderSteps = <StepTwo />;
      break;
    case 3:
      renderSteps = <Success />;
      break;
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <div className="flex flex-col items-center gap-y-20">
          {currentStep !== 3 && <Stepper steps={steps} currentStep={currentStep} />}
          {renderSteps}
        </div>
      </div>
    </Layout>
  );
}
