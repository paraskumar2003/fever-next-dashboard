import React from 'react';

const trafficData = [
    { services: 'Service', totals: 3550, color: 'bg-red-600' },
    { services: 'UPI', totals: 1245, color: 'bg-blue-800' },
    { services: 'E-Voucher', totals: 1798, color: 'bg-purple-700' },
    { services: 'Physical Products', totals: 986, color: 'bg-green-700' },
];

const BestTrafficSourceApi = () => {
    const maxVisitors = Math.max(...trafficData.map(data => data.totals));
    console.log(maxVisitors)
    return (
        <div className="h-auto w-full  bg-white rounded-lg ">
            <h1>Traffic Src Api</h1>
        </div>
    );
};

export default BestTrafficSourceApi;
