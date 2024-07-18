"use client";

import { Edit, Plus, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "./ui/select";
import Header from "./header";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useAuth from "@/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchAdmins,
  removeAdmin,
  saveUser,
  setAdminLoadingTrue,
} from "@/store/apps/user";
import { Loader } from "./loader";
import { IUser } from "@/interfaces";

// Define your form schema
const FormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  email: z.string().min(1),
  password: z.string().min(1),
  role: z.enum(["Admin", "User"]),
});

export const description =
  "A settings page. The settings page has a sidebar navigation and a main content area. The main content area has a form to update the store name and a form to update the plugins directory. The sidebar navigation has links to general, security, integrations, support, organizations, and advanced settings.";

export const iframeHeight = "780px";

export const containerClassName = "w-full h-full";

function AddEditAdmin({
  edit,
  editData,
}: {
  edit?: boolean;
  editData?: IUser;
}) {
  const store = useSelector((state: RootState) => state.user);
  const auth = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues:
      edit && editData
        ? {
            ...editData,
          }
        : {
            name: "",
            email: "",
            password: "",
            role: "Admin",
          },
  });
  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      dispatch(setAdminLoadingTrue());
      if (data.id) {
        await dispatch(saveUser(data as any));
      } else {
        await auth.createNewUser({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        });
      }

      dispatch(fetchAdmins(store.isToken));
    },
    [dispatch, store.isToken, auth]
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant={edit ? "outline" : "default"}
          className={edit ? "p-0 w-8 h-8" : ""}
        >
          {edit ? <Edit size={14} /> : <Plus size={16} />}
          {edit ? "" : "Add Admin"}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll custom-scrollbar">
        <SheetHeader>
          <SheetTitle>{edit ? "Edit " : "Add "}Admin</SheetTitle>
          <SheetDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem hidden>
                      <FormLabel>Id</FormLabel>
                      <FormControl>
                        <Input placeholder="id" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Admin" />
                            </FormControl>
                            <FormLabel className="font-normal">Admin</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="User" />
                            </FormControl>
                            <FormLabel className="font-normal">User</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <SheetFooter>
                  <SheetClose asChild>
                    <Button type="submit">Submit</Button>
                  </SheetClose>
                </SheetFooter>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default function Admin() {
  const store = useSelector((state: RootState) => state.user);
  const auth = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (store.isToken) {
      dispatch(setAdminLoadingTrue());
      dispatch(fetchAdmins(store.isToken));
    }
  }, [dispatch, store.isToken]);
  const handleDelete = useCallback(
    (userId: string) => {
      dispatch(setAdminLoadingTrue());
      dispatch(removeAdmin({ isToken: store.isToken, userId }));
      dispatch(fetchAdmins(store.isToken));
    },
    [dispatch, store.isToken]
  );

  if (auth.loading || store.adminsLoding) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div>
          <Card
            className="xl:col-span-2"
            x-chunk="A card showing a table of recent transactions with a link to view all transactions."
          >
            <CardHeader className="flex flex-row items-center">
              <div className="w-full gap-2 flex justify-between items-center">
                <CardTitle>Admin Control</CardTitle>
                <AddEditAdmin />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Admin Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {store.admins?.map((admin, index) => (
                    <TableRow key={index}>
                      <TableCell>{admin.name || ""}</TableCell>
                      <TableCell>{admin.email || ""} </TableCell>
                      <TableCell className="capitalize">{admin.role}</TableCell>
                      <TableCell className="flex gap-1">
                        <AddEditAdmin edit editData={admin} />
                        <Button
                          className="p-0 w-8 h-8"
                          variant={"destructive"}
                          onClick={() => {
                            if (admin.id) {
                              handleDelete(admin.id);
                            }
                          }}
                        >
                          <Trash size={14} className="p-0" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
