import { useState } from "react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, MetaFunction, redirect, useActionData, useNavigation, Link, json } from "@remix-run/react";
import { loanSessionStorage } from "@/.server/sessions";
import { createClient } from "@/.server/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { Checkbox } from "@/components/ui/checkbox";
import { TextField, ErrorMessage, Label } from "@/components/ui/form";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Layout from "@/components/shared/layout";

const schema = z
  .object({
    fullName: z.string({ required_error: "Fullname is required" }).min(4, "must contain at least 4 character(s)"),
    DNI: z.string({ required_error: "DNI is required" }),
    phone: z.string({ required_error: "Phone is required" }),
    email: z.string({ required_error: "Email is required" }).email("Please provide a correct email address"),
    password: z.string({ required_error: "Password is required" }).min(6, "Password is too short"),
    confirmPassword: z.string().min(6),
    terms: z
      .boolean()
      .default(false)
      .refine((val) => val === true, { message: "You must accept the terms" }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "The Passwords did not match", path: ["passwordNotMatch"] });
    }
  });

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
  const { supabase } = createClient(request);
  const userResult = await supabase.auth.signUp({
    email: submission.value.email,
    password: submission.value.password,
    options: { data: { dni: submission.value.DNI, fullname: submission.value.fullName, phone: submission.value.phone } },
  });
  if (userResult.error) {
    throw new Error(userResult.error.message, { cause: userResult.error });
  }
  // send loan data
  const user_id = userResult?.data?.user?.id;
  const amount = parseFloat(session.data.amount);
  const months = parseInt(session.data.months);
  const monthly_quota = parseFloat(session.data.monthly_quota);
  const interest = parseFloat(session.data.interest);
  const total = parseFloat(session.data.total);
  const date_of_return = session.data.date_of_return;
  const loanResult = await supabase.from("loans").insert([{ user_id, amount, months, monthly_quota, interest, total, date_of_return }]).select();
  if (loanResult.error) {
    throw new Error(loanResult.error.message, { cause: loanResult.error });
  }
  // delete loan metdata session
  return redirect("/login?message=account-created", { headers: { "Set-Cookie": await loanSessionStorage.destroySession(session) } });
}

export default function SignUp() {
  const [togglePassword, setTogglePassword] = useState(false);
  const lastResult = useActionData<typeof action>() as any;
  const constraint = getZodConstraint(schema);

  const [form, fields] = useForm({
    lastResult,
    constraint,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/create-account";

  return (
    <Layout>
      <div className="mt-44 max-w-2xl mx-auto px-6 lg:px-8">
        <Form method="post" {...getFormProps(form)}>
          <Card>
            <CardHeader>
              <CardTitle>Create your account</CardTitle>
              <CardDescription>Now we need some data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TextField labelProps={{ children: "Full name" }} inputProps={getInputProps(fields.fullName, { type: "text" })} errors={fields.fullName.errors} />
              <TextField labelProps={{ children: "DNI" }} inputProps={getInputProps(fields.DNI, { type: "text" })} errors={fields.DNI.errors} />
              <TextField
                labelProps={{ children: "Phone" }}
                inputProps={{ placeholder: "+34 xxx xxx xxxx", ...getInputProps(fields.phone, { type: "tel" }) }}
                errors={fields.phone.errors}
              />
              <TextField
                labelProps={{ children: "Email" }}
                inputProps={{ placeholder: "you@example.com", ...getInputProps(fields.email, { type: "email" }) }}
                errors={fields.email.errors}
              />
              <TextField
                labelProps={{ children: "Password" }}
                inputProps={{ placeholder: "•••••••", ...getInputProps(fields.password, { type: "password" }) }}
                errors={fields.password.errors}
              />
              <TextField
                labelProps={{ children: "Confirm Password" }}
                inputProps={{ placeholder: "•••••••", ...getInputProps(fields.confirmPassword, { type: "password" }) }}
                errors={fields.confirmPassword.errors}
              />
              {form.allErrors["passwordNotMatch"] ? (
                <div className="flex gap-x-2 items-center ">
                  <ExclamationCircleIcon className="w-6 h-6 text-destructive" />
                  <ErrorMessage>{form.allErrors["passwordNotMatch"]}</ErrorMessage>
                </div>
              ) : null}
              <div className="flex items-center gap-x-2">
                <Checkbox id="showPassword" onCheckedChange={() => setTogglePassword(!togglePassword)} />
                <Label htmlFor="showPassword" className="text-muted-foreground">
                  {togglePassword ? "Hide password" : "Show password"}
                </Label>
              </div>
              <div className="flex items-center gap-x-2">
                <Checkbox id={fields.terms.id} name={fields.terms.name} aria-invalid={!!fields.terms.allErrors["terms"]} />
                <Label htmlFor={fields.terms.id} className="text-muted-foreground">
                  Accept{" "}
                  <Link to={"#"} className="text-primary underline">
                    terms and conditions
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
        </Form>
      </div>
    </Layout>
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
