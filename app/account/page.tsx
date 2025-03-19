import RentPaymentForm from "@/components/RentPaymentForm";
import React from "react";

const RentReporting = () => {
  return (
    <section>
      <div className="container mx-auto px-4 py-8 pt-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2 pt-4">
              Fill out the form to report your rent payment to the credit bureau
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              All fields are required
            </p>
          </div>
          <RentPaymentForm />
        </div>
      </div>
    </section>
  );
};

export default RentReporting;
