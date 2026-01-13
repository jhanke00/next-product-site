"use client";

import { useRef } from "react";
import Card from "../components/Card";
import Footer from "../components/Footer";
import ProductGrid from "../components/ProductGrid";
import styles from "./page.module.css";

export default function Home() {

  const productRef = useRef<HTMLDivElement | null>(null);
  const scrollToProducts = () => {
    productRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className={styles.container}>
      <Card onScrollClick={scrollToProducts}/>
      <ProductGrid ref={productRef} />
      <Footer/>
    </main>
  );
}