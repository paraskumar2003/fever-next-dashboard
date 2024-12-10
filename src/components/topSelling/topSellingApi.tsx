"use client"
import React from 'react';
import TopSellingUi from './topSellingUi';

const TopSellingApi = () => {
    const products = [
        {
            name: "Repeat Customer Rate",
            category: "test",
            price: 1232,
            sold: 22,
            image: "image/top.jpg"
        },
        {
            name: "New Customer",
            category: "test",
            price: 1232,
            sold: 22,
            image: "image/top.jpg"
        },
        {
            name: "Repeat Customer",
            category: "test",
            price: 1232,
            sold: 22,
            image: "image/top.jpg"
        },
    ]

    return (
        <div className="space-y-6">
            <TopSellingUi products={products} />
        </div>
    );
};

export default TopSellingApi;
