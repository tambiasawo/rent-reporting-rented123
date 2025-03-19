import RentPaymentForm from "@/components/RentPaymentForm";
import React from "react";
import Image from "next/image";

const RentReporting = () => {
  return (
    <section>
      {/*    <div className="mb-2 py-3 ">
        <Image
          className="mx-auto"
          src="https://rented123-brand-files.s3.us-west-2.amazonaws.com/logo_white.svg"
          alt="Rented123"
          width={"80"}
          height={"80"}
        />
        <hr/>
      </div> */}

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
