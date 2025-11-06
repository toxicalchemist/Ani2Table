import React from 'react';

const ProductCard = ({ product, onClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer" onClick={onClick}>
      <div className="relative">
        <img 
          src={product.image || '/placeholder-rice.jpg'} 
          alt={product.name} 
          className="w-full h-48 object-cover"
        />
        {product.status && (
          <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold ${
            product.status === 'In Stock' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {product.status}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.type}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-primary">₱{product.price}/kg</span>
          {product.stock && (
            <span className="text-sm text-gray-500">Stock: {product.stock}kg</span>
          )}
        </div>
        {product.rating && (
          <div className="mt-2 flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
