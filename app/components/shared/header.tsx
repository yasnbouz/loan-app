import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/modeToggle";
import { Form, Link, useNavigation, useOutletContext } from "@remix-run/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Logo from "@/components/shared/logo";

const navigationList = [
  { name: "Product", href: "/" },
  { name: "Features", href: "/" },
  { name: "Marketplace", href: "/" },
  { name: "Company", href: "/" },
];
interface Session {
  user: any;
}
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const session = useOutletContext<Session>();
  const name = (session?.user?.user_metadata?.fullname ?? "") as string;
  const avatarName = name
    ?.split(" ")
    ?.slice(0, 2)
    .map((str) => str?.[0]?.toUpperCase());

  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/logout";

  return (
    <header>
      <div className="fixed px-6 inset-x-0 z-10 bg-background shadow-sm border-b">
        <nav className="mx-auto max-w-7xl flex items-center justify-between py-6" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Money eget</span>
              <Logo />
            </Link>
          </div>
          <div className="flex lg:hidden">
            <Button variant={"ghost"} className="-m-2.5  p-2.5 text-foreground" onClick={() => setMobileMenuOpen(true)}>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigationList.map((item) => (
              <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-foreground">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:items-center lg:gap-x-3 lg:flex lg:flex-1 lg:justify-end">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarFallback>{avatarName}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Form method="post" action="/logout">
                      <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Log Out..." : "Log Out"}
                      </button>
                    </Form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant={"outline"}>
                <Link to="/login">Log In</Link>
              </Button>
            )}
            <ModeToggle />
          </div>
        </nav>
      </div>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img className="h-8 w-auto" src="" alt="" />
            </Link>
            <button type="button" className="-m-2.5 rounded-md p-2.5 text-foreground" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigationList.map((item) => (
                  <Link key={item.name} to={item.href} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-primary-foreground">
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6 flex items-center justify-between">
                {session ? (
                  <Form method="post" action="/logout">
                    <Button type="submit" disabled={isSubmitting} variant={"outline"}>
                      {isSubmitting ? "Log Out..." : "Log Out"}
                    </Button>
                  </Form>
                ) : (
                  <Button asChild variant={"outline"}>
                    <Link to="/login">Log In</Link>
                  </Button>
                )}
                <ModeToggle />
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
