'use client'
import React from 'react';
import BarChart from './graphTableUi';

const GraphTableApi = () => {
    const chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', "Sep", 'Oct', 'Nov'];
    const chartData = [20, 12, 18, 25, 30, 10, 8, 47, 36, 40, 45, 50, 55];
    // const no_of_sales = ['No. of Sales']

    return (
        <div className=" space-y-6 ">
            <BarChart className="p-4 bg-white shadow-lg rounded-[6px] sm:text-[10px]"
                title="Monthly Sales"
                labels={chartLabels} data={chartData} />
        </div>
    );
};

export default GraphTableApi;