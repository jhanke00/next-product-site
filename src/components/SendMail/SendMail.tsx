'use client';
import React,{useEffect, useState} from 'react';
import { useAppSelector } from "../../../app/hooks";
import { AppDispatch } from "../../../app/store";
import { useDispatch } from "react-redux";
import { resetCartItems } from '../../../app/slices/ItemsIncartSlices';
import Link from "next/link";

export default function SuccessPage() {
    
    const dispatch: AppDispatch = useDispatch();
    useEffect(() => {
        //Reset cart items after successful payment
        dispatch(resetCartItems());

        const fetchSendMail = async() => {
        const res = await fetch("/api/send-mail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: '',
          });
        }
        fetchSendMail();
      }, []);
    return (
    <>
        <div className="row">
        <div className="col">
          <h4 className="mb-5">
            <Link href="/CartReview" className="text-decoration-none text-primary p-4">
              &#8592; Go to home
            </Link>
          </h4>
        </div>
      </div>
        <h2 className='text-green-600 text-2xl p-10'>✅ Payment Successful</h2>
    </> 
    )
}