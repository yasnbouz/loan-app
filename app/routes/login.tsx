import type { ActionFunctionArgs } from "@remix-run/node";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TextField, ErrorMessage } from "@/components/ui/form";
import { z } from "zod";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { json, redirect, useActionData, useNavigation, Form } from "@remix-run/react";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { createClient } from "@/.server/supabase";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Layout from "@/components/shared/layout";

const schema = z.object({
  email: z.string({ required_error: "Email is required" }).email("Please provide a correct email address"),
  password: z.string({ required_error: "Password is required" }).min(6, "Password is too short"),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }
  // login
  const { supabase, headers } = createClient(request);
  const { error } = await supabase.auth.signInWithPassword({ email: submission.value.email, password: submission.value.password });

  if (error) {
    return json({ error: error.message }, { status: error.status, headers });
  }

  return redirect("/join", { headers });
}

export default function Login() {
  const lastResult = useActionData<typeof action>() as any;
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/login";
  console.log(navigation);
  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });
  return (
    <Layout>
      <div className="mt-44 max-w-2xl mx-auto px-6 lg:px-8">
        <Form method="post" {...getFormProps(form)}>
          <Card>
            <CardHeader>
              <CardTitle>Login to Moneyeget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              {lastResult?.error && (
                <div className="flex gap-x-2 items-center">
                  <ExclamationCircleIcon className="w-6 h-6 text-destructive" />
                  <ErrorMessage>{lastResult?.error}</ErrorMessage>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Log In..." : "Log In"}
              </Button>
            </CardFooter>
          </Card>
        </Form>
      </div>
    </Layout>
  );
}
