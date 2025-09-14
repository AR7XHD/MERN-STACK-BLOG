import React from 'react'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RouteIndex, RouteSignUp } from "../helpers/RouteNames"
import { getEnv } from "../helpers/getEnv"
import { showToast } from '@/helpers/showtoast'
import { useNavigate, Link } from 'react-router-dom'
import GoogleLogin from '../components/GoogleLogin'
import { useDispatch, useSelector } from 'react-redux'
import { AddUser } from '../redux/user/userSlice'

const SignIn = () => {
  const { user, isloggedin } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values) {
    const response = await fetch(`${getEnv("VITE_BASE_URL")}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(values),
    })

    const data = await response.json();

    if (!response.ok) {
      showToast("error", data.message);
      return;
    }

    dispatch(AddUser(data.user));
    showToast("success", data.message);
    navigate(RouteIndex);
  }

  let sign = "signIn";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <GoogleLogin sign={sign} />
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-2 text-muted-foreground">
                OR
              </span>
            </div>
          </div>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
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
                      <Input placeholder="••••••••" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">Sign In</Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 items-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to={RouteSignUp} className="font-medium text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>

          {/* Go Back to Home Button */}
          <Button asChild variant="outline" className="w-full">
            <Link to={RouteIndex}>Go Back to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignIn
