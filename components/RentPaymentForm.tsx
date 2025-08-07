"use client";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formSchema, type FormValues } from "@/lib/validations/form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { UserRentInfoContext } from "@/lib/context/UserRentInfoContextProvider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "./ui/select";
import Link from "next/link";

export default function RentPaymentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);

  const {
    userRentInfo: { mepr_monthly_rent, id, ...rest },
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
  async function checkUserSubscription(id: number) {
    setIsCheckingSubscription(true);
    if (id) {
      try {
        const response = await fetch(`/api/check-subscription/?user_id=${id}`);
        const data = await response.json();
        if (data.success) setIsSubscriptionActive(true);
      } catch (e) {
        console.log("an error occurred");
      } finally {
        setIsCheckingSubscription(false);
      }
    }
  }
  React.useEffect(() => {
    checkUserSubscription(id);
    setCustomerRentData({ rent: parseFloat(mepr_monthly_rent) });
  }, [id]);

  async function onSubmit(data: FormValues) {
    if (!isSubscriptionActive) {
      toast.error("Active subscription required to submit rent payments");
      return;
    }
    try {
      setIsLoading(true);
      let [
        first_address,
        second_address,
        city,
        provinceState,
        postalZipCode,
        countryCode,
      ] = [
        rest["mepr-address-one"],
        rest["mepr-address-two"],
        rest["mepr-address-city"],
        rest["mepr-address-state"],
        rest["mepr-address-zip"],
        rest["mepr-address-country"],
      ];
      if (data.addressChanged && data.newAddress) {
        first_address = data.newAddress.address1;
        second_address = data.newAddress.address2;
        city = data.newAddress.city;
        provinceState = data.newAddress.provinceState;
        postalZipCode = data.newAddress.postalZipCode;
        countryCode = data.newAddress.countryCode;
      }
      const currentDate = format(new Date(), "MMddyyyy");

      const metro2Data = {
        //...data,
        "Account Number": rest.account_number,
        "Portfolio Type": "O",
        "Account Type": 29,
        "Date Opened": "27th of the last month",
        "Credit Limit": "",
        "Highest Credit": data.rentAmount,
        "Terms Duration": "001",
        "Terms Frequency": "M",
        "Scheduled Monthly Payment Amount": mepr_monthly_rent,
        "Actual Payment Amount": data.rentAmount,
        "Account Status": "11",
        "Payment Rating": "",
        "Payment History Profile": "BBBBBBBBBBBBBBBBBBBBBBBB",
        "Special Comment": "",
        "Compliance Condition Code": "",
        "Current Balance": Math.floor(mepr_monthly_rent - data.rentAmount),
        "Amount Past Due": "000000000",
        "Original Charge-Off Amount": "",
        "Date of Account Information": currentDate, //chech this
        "Date of First Delinquency": "",
        "Date Closed": "",
        "Date of Last Payment": "",
        "Interest Type Indicator": "",
        Surname: rest.last_name,
        "First Name": rest.first_name,
        "Middle Name": "",
        "Generation Code": "",
        "Social Security Number": data.sin,
        "Date of Birth": rest.mepr_date_of_birth,
        "Telephone Number": data.phoneNumber,
        "ECOA Code": "1",
        "Consumer Information Indicator": "",
        "Country Code": countryCode,
        "First Line of Address": first_address,
        "Second Line of Address": second_address,
        City: city,
        "State / Province Code": provinceState,
        "Zip Code": postalZipCode,
        "Address Indicator": "",
        "Residence Code": "",
      };
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metro2Data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      toast.success("Form submitted successfully. You can now log out");
      form.reset();
    } catch (error) {
      toast.error("Failed to submit form");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isCheckingSubscription) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Verifying subscription...</span>
      </div>
    );
  }

  if (!isSubscriptionActive) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Subscription Required
        </h2>
        <p className="text-gray-600">
          An active subscription is required to report rent payments. Please
          subscribe to continue.
        </p>
        <Button className="mt-3">
          <Link href="https://rented123.com/login" target="_blank">
            Verify your Subscription
          </Link>
        </Button>
      </div>
    );
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
              <FormDescription>
                Your SIN is required for credit reporting and is securely
                transmitted
              </FormDescription>
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
                  maxLength={32}
                  className={cn(
                    form.formState.errors.confirmationNumber &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </FormControl>
              <FormDescription>
                Enter the confirmation number from your online rent payment
              </FormDescription>
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
                  step="5"
                  placeholder="Enter rent amount"
                  {...field}
                  value={field.value || customerRentData.rent || ""}
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
                        countryCode: "CN",
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
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue="CN"
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full",
                            form.formState.errors.newAddress?.countryCode &&
                              "border-red-500 focus-visible:ring-red-500"
                          )}
                        >
                          {field.value !== "CN" ? "USA" : "Canada"}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Country</SelectLabel>
                            <SelectItem value="CN">Canada</SelectItem>
                            <SelectItem value="US">USA</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid place-items-center">
              <FormDescription className="flex justify-center gap-2 items-center">
                <Info fontSize={8} />
                <span>
                  Please update your address on your{" "}
                  <Link
                    className="underline"
                    href="https://rented123.com/account/?action=home"
                    target="_blank"
                  >
                    profile
                  </Link>{" "}
                  for future reporting
                </span>
              </FormDescription>
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
