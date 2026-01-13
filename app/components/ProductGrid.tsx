"use client"
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import styles from "./ProductGrid.module.css";
import { useRouter } from "next/navigation";
import products from "../../store/productsSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { forwardRef } from "react";

const ProductGrid = forwardRef<HTMLDivElement>((props, ref) => {
    const data = useSelector((state: RootState) => state.products.items);
    console.log("data in grid ", data);
    const [selectedCategory, setSelectedCategory] = useState("");
    const category = [...new Set(data.map(product => product.category))];
    console.log("categories", category);
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
  if (data.length > 0) {
    setSelectedCategory(data[0].category);
  }
}, [data]);

const filteredProducts = searchTerm
  ? data.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : selectedCategory
  ? data.filter((p) => p.category === selectedCategory)
  : data;

    return (
        <section className={styles.gridSection}>
            <div className={styles.sectionone}>
                <h2 className={styles.heading}>Unlock Exclusive Savings!</h2>
                <p>Select your favorite category and enjoy shopping..</p>
            </div>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
            <div className={styles.sectiontwo} ref={ref}>
                {category.map(cat => (
                    <button key={cat} className={`${styles.category} ${!searchTerm && selectedCategory === cat ? styles.active : ''
                        }`} onClick={() => setSelectedCategory(cat)}>
                        {cat}
                    </button>
                ))}
            </div>
            <div className={styles.grid}>
                {selectedCategory && (
                    <div>
                        <div className={styles.gridone}>
                            {filteredProducts.length === 0 && <p>No products available.</p>}

                            <ul className={styles.ulstyle}>
                                {filteredProducts.map(product => (
                                    
                                    <li
                                        key={product.id}
                                       className={styles.listyle}
                                        onClick={() => router.push(`/catalog/${product.id}`)}
                                    >
                                        <h3>{product.name}</h3>
                                        <h4>Category - {product.category}</h4>
                                        <p>{product.description}</p>
                                        <p><strong>Price:</strong> ${product.price}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
)
ProductGrid.displayName = "ProductGrid";
export default ProductGrid;
