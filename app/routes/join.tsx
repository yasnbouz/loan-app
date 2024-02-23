import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form as RemixForm, MetaFunction, redirect, useActionData, useNavigation } from "@remix-run/react";
import { loanSessionStorage } from "@/.server/sessions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { parseWithZod } from "@conform-to/zod";
import { useForm } from "@conform-to/react";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, Text } from "@/components/ui/form";

const schema = z
  .object({
    fullName: z.string({ required_error: "Full name is required" }).min(4, "Full name must contain at least 4 character(s)"),
    DNI: z.string({ required_error: "DNI is required" }),
    phone: z.string({ required_error: "phone is required" }),
    email: z.string({ required_error: "Email is required" }).email("Email is invalid"),
    password: z.string({ required_error: "password is required" }),
    confirmPassword: z.string({ required_error: "confirm Password is required" }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "The Passwords did not match", path: ["passwordError"] });
    }
  });

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await loanSessionStorage.getSession(request.headers.get("Cookie"));
  // if user enter to signup page directly, there is no loan metadata stored yet, so we must redirect the user to home page to fill the loan form
  if (Object.keys(session.data).length === 0) {
    return redirect("/");
  }
  return null;
}
export async function action({ request }: ActionFunctionArgs) {
  // get signup formdata
  const formData = await request.formData();
  // get loan meta data from session
  const session = await loanSessionStorage.getSession(request.headers.get("Cookie"));
  // if session empty redirect to home page
  if (Object.keys(session.data).length === 0) {
    return redirect("/");
  }
  // form validation
  const submission = parseWithZod(formData, { schema });
  // Send the submission back to the client if the status is not successful
  if (submission.status !== "success") {
    return submission.reply();
  }
  // send to database

  return redirect("/");
}

export default function SignUp() {
  const [togglePassword, setTogglePassword] = useState(false);
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
  });
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/join";
  console.log(fields.fullName.errors);
  return (
    <div className="mt-44 max-w-2xl mx-auto px-6 lg:px-8">
      <RemixForm method="post" id={form.id} onSubmit={form.onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Now we need some data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField name={fields.fullName.name} label="Full Name" error={fields.fullName.errors} />
            <FormField name={fields.DNI.name} label="DNI" error={fields.DNI.errors} />
            <FormField name={fields.phone.name} label="Phone" error={fields.phone.errors} />
            <FormField name={fields.email.name} label="Email" error={fields.email.errors} />
            <FormField type={togglePassword ? "text" : "password"} name={fields.password.name} label="Password" error={fields.password.errors} />
            <FormField type={togglePassword ? "text" : "password"} name={fields.confirmPassword.name} label="Confirm Password" error={fields.confirmPassword.errors} />
            <div className="flex items-center gap-x-2">
              <Checkbox id="showPassword" onCheckedChange={() => setTogglePassword(!togglePassword)} />
              <label htmlFor="showPassword" className="text-muted-foreground">
                {togglePassword ? "Hide password" : "Show password"}
              </label>
            </div>
            <Text slot="errorMessage">{form.allErrors["passwordError"]}</Text>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting === true ? "Creating..." : "Create Account"}
            </Button>
            <Button type="reset" variant={"outline"}>
              Clear
            </Button>
          </CardFooter>
        </Card>
      </RemixForm>
    </div>
  );
}
export const meta: MetaFunction = () => {
  return [
    {
      title: "Join our Loan system",
      description: "",
    },
  ];
};
