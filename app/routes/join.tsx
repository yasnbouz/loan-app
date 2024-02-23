import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form as RemixForm, MetaFunction, redirect, useActionData, useNavigation, Link } from "@remix-run/react";
import { loanSessionStorage } from "@/.server/sessions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { parseWithZod } from "@conform-to/zod";
import { useForm } from "@conform-to/react";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, Text, Label } from "@/components/ui/form";
import { cn } from "@/lib/utils";

const schema = z
  .object({
    fullName: z.string({ required_error: "full name is required" }).min(4, "Full name must contain at least 4 character(s)"),
    DNI: z.string({ required_error: "DNI is required" }),
    phone: z.string({ required_error: "phone is required" }),
    email: z.string({ required_error: "email is required" }).email("Email is invalid"),
    password: z.string({ required_error: "password is required" }),
    confirmPassword: z.string({ required_error: "confirm Password is required" }),
    terms: z.boolean(),
  })
  .superRefine(({ password, confirmPassword, terms }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "The Passwords did not match", path: ["passwordError"] });
    }
    if (!terms) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "You must accept the terms", path: ["terms"] });
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
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/join";

  return (
    <div className="mt-44 max-w-2xl mx-auto px-6 lg:px-8">
      <RemixForm method="post" id={form.id} onSubmit={form.onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Now we need some data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField field={fields.fullName} label="Full Name" />
            <FormField field={fields.DNI} label="DNI" />
            <FormField field={fields.phone} label="Phone" />
            <FormField field={fields.email} label="Email" />
            <FormField field={fields.password} type={togglePassword ? "text" : "password"} label="Password" />
            <FormField field={fields.confirmPassword} type={togglePassword ? "text" : "password"} label="Confirm Password" />
            {form.allErrors["passwordError"] ? (
              <Text slot="errorMessage" className="inline-block">
                {form.allErrors["passwordError"]}
              </Text>
            ) : null}
            <div className="flex items-center gap-x-2">
              <Checkbox id="showPassword" onCheckedChange={() => setTogglePassword(!togglePassword)} />
              <Label htmlFor="showPassword" className="text-muted-foreground">
                {togglePassword ? "Hide password" : "Show password"}
              </Label>
            </div>
            <div className="flex items-center gap-x-2">
              <Checkbox id={fields.terms.id} name={fields.terms.name} className={cn({ "border-destructive": form.allErrors["terms"] })} />
              <Label htmlFor={fields.terms.id} className="text-muted-foreground">
                I agree to the{" "}
                <Link to={"#"} className="text-primary underline">
                  BRAND Terms
                </Link>
              </Label>
            </div>
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
