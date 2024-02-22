import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, MetaFunction, redirect, useActionData, useNavigation } from "@remix-run/react";
import { loanSessionStorage } from "@/.server/sessions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { z } from "zod";
import { parseWithZod } from "@conform-to/zod";
import { useForm } from "@conform-to/react";
import { FieldErrorMessage } from "@/components/ui/field-error";

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

  return (
    <div className="mt-44 max-w-2xl mx-auto px-6 lg:px-8">
      <Form method="post" id={form.id} onSubmit={form.onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Personal loan simulation</CardTitle>
            <CardDescription>Now we need some data</CardDescription>
            <p>{form.errors}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={fields.fullName.id}>Full Name</Label>
              <Input type="text" name={fields.fullName.name} id={fields.fullName.id} />
              <FieldErrorMessage>{fields.fullName.errors}</FieldErrorMessage>
            </div>
            <div className="space-y-2">
              <Label htmlFor={fields.DNI.id}>DNI</Label>
              <Input type="text" name={fields.DNI.name} id={fields.DNI.id} />
              <FieldErrorMessage>{fields.DNI.errors}</FieldErrorMessage>
            </div>
            <div className="space-y-2">
              <Label htmlFor={fields.phone.id}>Phone Number</Label>
              <Input type="text" name={fields.phone.name} id={fields.phone.id} />
              <FieldErrorMessage>{fields.phone.errors}</FieldErrorMessage>
            </div>
            <div className="space-y-2">
              <Label htmlFor={fields.email.id}>Email</Label>
              <Input type="email" name={fields.email.name} id={fields.email.id} />
              <FieldErrorMessage>{fields.email.errors}</FieldErrorMessage>
            </div>
            <div className="flex flex-col sm:flex-row gap-x-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor={fields.password.id}>Password</Label>
                <Input type={togglePassword === false ? "password" : "text"} name={fields.password.name} id={fields.password.id} />
                <FieldErrorMessage>{fields.password.errors}</FieldErrorMessage>
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor={fields.confirmPassword.id}>Confirm Password</Label>
                <div className="flex">
                  <Input type={togglePassword === false ? "password" : "text"} name={fields.confirmPassword.name} id={fields.confirmPassword.id} />
                  <Toggle onClick={() => setTogglePassword(!togglePassword)} className="self-end">
                    {togglePassword === true ? <EyeIcon className="w-6 h-6" /> : <EyeSlashIcon className="w-6 h-6" />}
                  </Toggle>
                </div>
                <FieldErrorMessage>{fields.confirmPassword.errors}</FieldErrorMessage>
              </div>
            </div>
            <FieldErrorMessage>{form.allErrors["passwordError"]}</FieldErrorMessage>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting === true ? "Creating..." : "Create Account"}
            </Button>
            <Button type="reset" variant={"outline"}>
              Reset
            </Button>
          </CardFooter>
        </Card>
      </Form>
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
