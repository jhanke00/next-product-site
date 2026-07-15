export type HomepageCategory = {
  id: string;
  label: string;
  query: string;
  match: (productCategory: string) => boolean;
};

export const homepageCategories: HomepageCategory[] = [
  {
    id: 'electronics',
    label: 'Electronics',
    query: 'electronics',
    match: (category) => /electronics|computer|audio|mobile|camera|gadget/i.test(category),
  },
  {
    id: 'home',
    label: 'Home',
    query: 'home',
    match: (category) => /home|decor|furniture|kitchen|garden/i.test(category),
  },
  {
    id: 'jewelery',
    label: 'Jewellery',
    query: 'jewellery',
    match: (category) => /jewelery|jewelry|watch|accessories/i.test(category),
  },
  {
    id: 'Grocery',
    label: 'Grocery',
    query: 'Grocery',
    match: (category) => /Grocery|apple|sweet|juice/i.test(category),
  },
];

export type SiteNavLink = {
  id: string;
  label: string;
  href: string;
  active?: boolean;
};

export function buildCategoryNavLinks(allProducts: any[]) {
  return homepageCategories.map((category) => {
    return {
      id: category.id,
      label: category.label,
      href: `/products/category/${category.id}`,
    };
  });
}

export function buildHomepageCards(allProducts: any[]) {
  return homepageCategories.map((category) => {
    const product = allProducts.find((product) => category.match(product.category)) ?? allProducts[0];

    return {
      id: category.id,
      label: category.label,
      query: category.query,
      href: `/products/category/${category.id}`,
      product,
    };
  });
}
