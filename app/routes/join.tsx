import { loanSessionStorage } from "@/.server/sessions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, MetaFunction, redirect } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";

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

  return null;
}

export default function SignUp() {
  const [togglePassword, setTogglePassword] = useState(false);
  return (
    <div className="mt-44 max-w-2xl mx-auto px-6 lg:px-8">
      <Form method="post">
        <Card>
          <CardHeader>
            <CardTitle>Personal loan simulation</CardTitle>
            <CardDescription>Now we need some data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={"Full Name"}>Full Name</Label>
              <Input type="text" name="fullname" id="fullname" />
            </div>
            <div className="space-y-2">
              <Label htmlFor={"DNI"}>DNI</Label>
              <Input type="text" name="DNI" id="DNI" />
            </div>
            <div className="space-y-2">
              <Label htmlFor={"Phone Number"}>Phone Number</Label>
              <Input type="text" name="phoneNumber" id="phoneNumber" />
            </div>
            <div className="space-y-2">
              <Label htmlFor={"Email"}>Email</Label>
              <Input type="email" name="email" id="email" />
            </div>
            <div className="flex gap-x-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor={"Password"}>Password</Label>
                <Input type={togglePassword === false ? "password" : "text"} name="password" id="password" />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor={"Confirm Password"}>Confirm Password</Label>
                <Input type={togglePassword === false ? "password" : "text"} name="confirmPassword" id="confirmPassword" />
              </div>
              <Toggle onClick={() => setTogglePassword(!togglePassword)} className="self-end">
                {togglePassword === true ? <EyeIcon className="w-6 h-6" /> : <EyeSlashIcon className="w-6 h-6" />}
              </Toggle>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit">Create Account</Button>
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
