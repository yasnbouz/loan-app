import type { ActionFunctionArgs } from "@remix-run/node";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, Text } from "@/components/ui/form";
import { Form } from "react-aria-components";
import { z } from "zod";
import { parseWithZod } from "@conform-to/zod";
import { json, redirect, useActionData } from "@remix-run/react";
import { useForm } from "@conform-to/react";
import { createClient } from "@/.server/supabase";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

const schema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string().min(6, "must contain at least 6 character(s)"),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }
  // login
  const supabase = createClient(request);
  const { error } = await supabase.auth.signInWithPassword({ email: submission.value.email, password: submission.value.password });
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  return null;
}

export default function Login() {
  const lastResult = useActionData<typeof action>() as any;

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });
  return (
    <div className="mt-44 max-w-2xl mx-auto px-6 lg:px-8">
      <Form method="post" id={form.id} onSubmit={form.onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Login to Moneyeget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Email" field={fields.email} type="email" autoComplete="email" />
            <FormField label="Password" field={fields.password} type="password" />
            {lastResult?.error && (
              <div className="flex gap-x-2 items-center">
                <ExclamationCircleIcon className="w-6 h-6 text-destructive" />
                <Text slot="errorMessage">{lastResult?.error}</Text>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button>Log In</Button>
          </CardFooter>
        </Card>
      </Form>
    </div>
  );
}
