"use client";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formSchema, type FormValues } from "@/lib/validations/form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { UserRentInfoContext } from "@/lib/context/UserRentInfoContextProvider";

export default function RentPaymentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    userRentInfo: { mepr_monthly_rent },
  } = UserRentInfoContext();

  const [customerRentData, setCustomerRentData] = useState({
    rent: parseFloat(mepr_monthly_rent),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sin: "",
      confirmationNumber: "",
      phoneNumber: "",
      rentAmount: undefined,
      addressChanged: false,
      newAddress: null,
      paymentDate: undefined,
    },
  });

  React.useEffect(() => {
    setCustomerRentData({ rent: parseFloat(mepr_monthly_rent) });
  }, [mepr_monthly_rent]);

  async function onSubmit(data: FormValues) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      toast.success("Form submitted successfully");
      form.reset();
    } catch (error) {
      toast.error("Failed to submit form");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="sin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Social Insurance Number (SIN)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your 9-digit SIN"
                  {...field}
                  maxLength={9}
                  pattern="\d*"
                  inputMode="numeric"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    field.onChange(value);
                  }}
                  className={cn(
                    form.formState.errors.sin &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Confirmation Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter confirmation number"
                  {...field}
                  maxLength={8}
                  className={cn(
                    form.formState.errors.confirmationNumber &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="(123) 456-7890"
                  {...field}
                  className={cn(
                    form.formState.errors.phoneNumber &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rentAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rent Amount ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter rent amount"
                  {...field}
                  value={field.value || customerRentData.rent || 0}
                  onChange={(e) => {
                    const value =
                      e.target.value &&
                      Math.max(0, parseFloat(e.target.value) || 0);
                    field.onChange(value);
                  }}
                  className={cn(
                    form.formState.errors.rentAmount &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressChanged"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Has your address changed?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    const isChanged = value === "true";
                    field.onChange(isChanged);
                    if (!isChanged) {
                      form.setValue("newAddress", null);
                    } else {
                      form.setValue("newAddress", {
                        address1: "",
                        address2: "",
                        city: "",
                        provinceState: "",
                        postalZipCode: "",
                        countryCode: "",
                      });
                    }
                  }}
                  defaultValue={field.value ? "true" : "false"}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="true" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="false" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("addressChanged") && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="newAddress.address1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Street address"
                      {...field}
                      className={cn(
                        form.formState.errors.newAddress?.address1 &&
                          "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newAddress.address2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2 (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Apartment, suite, unit, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="newAddress.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="City"
                        {...field}
                        className={cn(
                          form.formState.errors.newAddress?.city &&
                            "border-red-500 focus-visible:ring-red-500"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newAddress.provinceState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province/State</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Province or State"
                        {...field}
                        className={cn(
                          form.formState.errors.newAddress?.provinceState &&
                            "border-red-500 focus-visible:ring-red-500"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="newAddress.postalZipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal/ZIP Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Postal or ZIP code"
                        {...field}
                        className={cn(
                          form.formState.errors.newAddress?.postalZipCode &&
                            "border-red-500 focus-visible:ring-red-500"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newAddress.countryCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., CA, US"
                        {...field}
                        maxLength={2}
                        className={cn(
                          form.formState.errors.newAddress?.countryCode &&
                            "border-red-500 focus-visible:ring-red-500"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="paymentDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Payment Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                        form.formState.errors.paymentDate &&
                          "border-red-500 focus-visible:ring-red-500"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
