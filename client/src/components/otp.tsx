"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useMutation } from "@tanstack/react-query"
import { VerifyOtp } from "@/api/settings"
import { useEffect } from "react"

const FormSchema = z.object({
    pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
})

export function InputOTPForm({
    iscancel,
    isverified,
    isLoading,
    message
}: {
    iscancel: (e: boolean) => void,
    isverified: (e: boolean) => void,
    isLoading: (e: boolean) => void
    message: (e: string) => void
}) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
        },
    })

    const { mutateAsync: verifyotp, isPending: verifyotpLoading } = useMutation({
        mutationFn: VerifyOtp,
        onSuccess: async (data) => {
            if (!data.success) {
                isLoading(false)
                isverified(false)
                message(data.message)
                return
            } else {
                isLoading(false)
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
                isverified(true)
                return
            }
        },
        onError: (data) => {
            isLoading(false)
            isverified(false)
            console.error(data)
            return
        }
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        if (!data.pin) return
        await verifyotp({ otp: Number(data.pin) })
    }

    useEffect(() => {
        if (verifyotpLoading) isLoading(verifyotpLoading)
    }, [verifyotpLoading])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>One-Time Password</FormLabel>
                            <FormControl>
                                <InputOTP maxLength={6} {...field}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormDescription>
                                Please enter the one-time password sent to your email.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex items-center gap-2">
                    <Button onClick={() => iscancel(false)} variant={`ghost`} size={`sm`} type="button">Cancel</Button>
                    <Button variant={`default`} size={`sm`} type="submit">Submit</Button>
                </div>

            </form>
        </Form>
    )
}
