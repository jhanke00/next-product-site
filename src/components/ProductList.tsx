import React from 'react';
import { Product } from '@type/products';
import largeProductData from '../mock/large/products.json';

const PAGE_SIZE = 8;
const maxVisiblePages = 10;

const ProductList = () => {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState('');

  const products: Product[] = largeProductData.map((product) => ({
    ...product,

    id: Number(product.id),
    price: Number(product.price),
  }));

  //Filter products based on search query
  const filteredProducts = products.filter((product) => {
    return product.name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  const totalPages = Math.ceil(products.length / PAGE_SIZE);

  const renderPagination = () => {
    const buttons = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    //add first page button

    if (currentPage > Math.floor(maxVisiblePages / 2) + 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
          style={{
            marginRight: '5px',
            padding: '5px 10px',
            backgroundColor: currentPage === 1 ? 'darkblue' : 'white',
            color: currentPage === 1 ? 'white' : 'black',
            border: '1px solid #ddd',
          }}
        >
          1
        </button>
      );

      if (currentPage > Math.floor(maxVisiblePages / 2) + 2) {
        buttons.push(<span key='start-ellipsis'>...</span>);
      }
    }

    // add numbered buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          style={{
            marginRight: '5px',
            padding: '5px 10px',
            backgroundColor: currentPage === i ? 'darkblue' : 'white',
            color: currentPage === i ? 'white' : 'black',
            border: '1px solid #ddd',
          }}
        >
          {i}
        </button>
      );
    }
    // add last page button
    if (currentPage < totalPages - Math.floor(maxVisiblePages / 2)) {
      if (currentPage < totalPages - Math.floor(maxVisiblePages / 2) - 1) {
        buttons.push(<span key='end-ellipsis'>...</span>);
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          style={{
            marginRight: '5px',
            padding: '5px 10px',
            backgroundColor: currentPage === totalPages ? 'darkblue' : 'white',
            color: currentPage === totalPages ? 'white' : 'black',
            border: '1px solid #ddd',
          }}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage(1);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div>
      <div>
        <input
          type='text'
          placeholder='Search Products'
          style={{ padding: '10px', margin: '20px 20px 20px 20px', width: '300px' }}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '20px' }}>
        {paginatedProducts.map((product: Product) => (
          <div
            key={product.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              width: '300px',
              cursor: 'pointer',
            }}
            onClick={() => handleProductClick(product)}
            onMouseOver={(e) => handleCardHover(e, product.id)}
            onMouseOut={(e) => handleCardHover(e, null)}
          >
            <div>
              <h3 style={{ color: 'darkblue' }}>{product.name}</h3>
              <p style={{ fontSize: 'small' }}>
                <strong style={{ fontSize: 'small' }}>Description: </strong>
                {product.description}
              </p>
              <p style={{ fontSize: 'small' }}>
                <strong style={{ fontSize: 'small' }}>Category: </strong>
                {product.category}
              </p>
            </div>
            <div>
              <h3 style={{ color: 'darkblue' }}>Price:{product.price}</h3>
            </div>
          </div>
        ))}

        {selectedProduct && (
          // <div style ={{position:'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '50px', backgroundColor: '#fff', border: '2px solid #444'}}>
          <div
            style={{
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.5',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', maxWidth: '600px' }}>
              <h3 style={{ color: 'darkblue', textAlign: 'center' }}>Product Details</h3>
              <h4>{selectedProduct.name}</h4>
              <p> Description: {selectedProduct.description}</p>
              <p> Category: {selectedProduct.category}</p>
              <p> Rating: {selectedProduct.rating}</p>
              <p>No. of Reviews: {selectedProduct.numReviews}</p>
              <p> Price: {selectedProduct.price}</p>
              <button
                style={{ float: 'right', color: 'white', backgroundColor: 'darkblue' }}
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      {/* <div style={{display:'flex',flex:'wrap', marginBottom:'10px',position:'relative'}}> */}

      {renderPagination()}

      {/* </div> */}
    </div>
  );
};
export const handleCardHover = (e: React.MouseEvent, id: number | null) => {
  const card = e.currentTarget as HTMLDivElement;
  card.style.boxShadow = id !== null ? '0 0 10px 0 #000' : 'none';
};

export default ProductList;
