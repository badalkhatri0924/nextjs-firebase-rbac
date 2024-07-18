"use client";

import Link from "next/link";
import { User2Icon, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import React, { useMemo } from "react";
import useAuth from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function Header() {
  const auth = useAuth();
  const store = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    auth.logout();
  };

  const headerData = useMemo(() => {
    return store.user?.role === "Admin"
      ? [
          { title: "Home", redirect: "/" },
          { title: "Restricted Page", redirect: "/restricted-page" },
        ]
      : [{ title: "Home", redirect: "/" }];
  }, [store.user?.role]);

  return (
    <header className="sticky top-0 flex h-16 items-center border-b bg-primary px-4 md:px-6 z-[10]">
      <nav className="hidden flex-col text-lg font-medium md:flex md:flex-row md:items-center  md:text-sm ">
        <div className="flex items-center gap-6 ml-6">
          {headerData.map((header) => (
            <Link
              key={header.title}
              href={header.redirect}
              className="text-secondary transition-colors hover:text-secondary-foreground"
            >
              {header.title}
            </Link>
          ))}
        </div>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              {/* <Package2 className="h-6 w-6" /> */}
              <span className="sr-only">Acme Inc</span>
            </Link>

            {headerData.map((header) => (
              <Link
                key={header.title}
                href={header.redirect}
                className="text-foreground transition-colors hover:text-foreground"
              >
                {header.title}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          {/* <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div> */}
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <User2Icon className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>

            {store.user?.role === "Admin" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={"/manage-user"}>Manage Users</Link>
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
