// RelatedProducts.jsx
import React, { useState, useEffect } from 'react';
import './RelatedProducts.css';
import Item from '../Item/Item';

const RelatedProducts = ({ category, currentProductId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchRelatedProducts = () => {
      fetch('http://localhost:4000/relatedproducts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category }),
      })
      .then((res) => res.json())
      .then((data) => {
        // Filter out the current product from related products
        const filteredProducts = data.filter((product) => product.id !== currentProductId);
        // Shuffle the array
        const shuffledProducts = shuffleArray(filteredProducts);
        // Select only the first 4 elements
        const selectedProducts = shuffledProducts.slice(0, 4);
        setRelatedProducts(selectedProducts);
      })
      .catch((error) => console.error('Error fetching related products:', error));
    };

    fetchRelatedProducts();
  }, [category, currentProductId]);

  // Function to shuffle array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <div className='relatedproducts'>
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item">
        {relatedProducts.map((item) => (
          <Item
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
