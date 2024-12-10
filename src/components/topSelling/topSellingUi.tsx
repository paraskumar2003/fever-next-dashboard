"use client"
import React from 'react';

interface Product {
    name: string;
    category: string;
    price: number;
    sold: number;
    image: string;
}

interface TopSellingProductsProps {
    products: Product[];
}

const TopSellingUi: React.FC<TopSellingProductsProps> = ({ products }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-sm">
            <div className="flex items-center mb-4">
                <svg className="h-6 w-6 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM11 14H9v-2h2v2zm4 0h-2v-2h2v2zm3-7H6c-.553 0-1 .447-1 1s.447 1 1 1h12c.553 0 1-.447 1-1s-.447-1-1-1z" />
                </svg>
                <h2 className="text-lg font-semibold text-[#505D7E]">Top Selling Product Catalog</h2>
            </div>
            {products.map((product, index) => (
                <div
                    key={index}
                    className="flex items-center p-3 border border-gray-200 rounded-lg mb-2"
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-full mr-3  border-4 border-[#DDE4FC]"
                    />
                    <div className="flex-1">
                        <h3 className="font-semibold text-[#505D7E]">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-[#4A5A79]">${product.price}</p>
                        <p className="text-sm text-gray-500">{product.sold} Sold</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TopSellingUi;
