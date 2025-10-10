'use client';
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { AppDispatch } from "../../../app/store";
import { useAppSelector } from "../../../app/hooks";
import { setShippingInfo } from "../../../app/slices/ItemsIncartSlices";
import { ShippingInfo } from "../../../app/types/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { goToStep } from "../../../app/slices/ItemsIncartSlices";
import styles from './ShippingDetails.module.scss';

const userSchema = z.object({
  name: z.string().min(2, { message: "Name at least 2 chars." }),
  address: z.string().min(10, { message: "Address at least 10 chars." }),
  city: z.string().min(2, { message: "City at least 2 chars." }),
  zipcode: z.string().regex(/^\d{6}$/, { message: "Enter 6-digit number." }),
});

type YourFormSchemaType = z.infer<typeof userSchema>;

const ShippingDetails: React.FC = () => {
  const [shippingData, setShippingData] = useState<ShippingInfo>({
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<YourFormSchemaType>({
    resolver: zodResolver(userSchema),
  });

  const dispatch: AppDispatch = useDispatch();

  const productInCart = useAppSelector((state) => state.cartItem.items);

  const onSubmit = async (data: any) => {
    dispatch(setShippingInfo(data));
    dispatch(goToStep("shipping"));

    setLoading(true);
    
    const res = await fetch("/api/checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: productInCart }),
    });

    const resultData = await res.json();

    const stripePromise = await loadStripe(process.env.STRIPE_PUBLISH_KEY);
      const stripe = await stripePromise;
    
     if(resultData.url) {
        window.location.href = resultData.url
     } else {
        console.log("url not valid")
     }
    setLoading(false);
  };

  return (
    <div className={styles.myForm}>
      <div className="row">
        <div className="col">
          <h4 className="mb-5">
            <Link href="/CartReview" className="text-decoration-none text-primary py-4">
              &#8592; Back
            </Link>
          </h4>
        </div>
      </div>
      <h2>Shipping Details</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={`form-group ${styles.fromGroup}`}>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            {...register("name", { required: true, minLength: 2 })}
          />
          {errors.name && <span className={styles.errorSection}>{errors.name.message}</span>}
        </div>
        <div className={`form-group ${styles.fromGroup}`}>
          <label htmlFor="address">Address:</label>
          <input {...register("address", { required: true, minLength: 2 })} />
          {errors.address && <span className={styles.errorSection}>{errors.address.message}</span>}
        </div>
        <div className={`form-group ${styles.fromGroup}`}>
          <label htmlFor="city">City:</label>
          <input {...register("city", { required: true, minLength: 2 })} />
          {errors.city && <span className={styles.errorSection}>{errors.city.message}</span>}
        </div>
        <div className={`form-group ${styles.fromGroup}`}>
          <label htmlFor="zipcode">Zipcode:</label>
          <input
            id="zipcode"
            type="text" 
            {...register("zipcode", { required: true, maxLength: 6 })}
          />
          {errors.zipcode && <span className={styles.errorSection}>{errors.zipcode.message}</span>}
        </div>

        <button disabled={loading} className="btn btn-primary mt-5" type="submit">
            {loading ? 'Processing...' : 'Pay with Stripe'}
        </button>
      </form>
    </div>
  );
};

export default ShippingDetails;
