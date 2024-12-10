import React from 'react';

const trafficData = [
    { services: 'Service', totals: 3550, color: 'bg-red-600' },
    { services: 'UPI', totals: 1245, color: 'bg-blue-800' },
    { services: 'E-Voucher', totals: 1798, color: 'bg-purple-700' },
    { services: 'Physical Products', totals: 986, color: 'bg-green-700' },
];

const BestTrafficSource = () => {
    const maxVisitors = Math.max(...trafficData.map(data => data.totals));

    return (
        <div className="h-auto w-full  bg-white rounded-lg ">
            <h2 className="text-[15px] px-2  mt-3 text-gray-600 font-semibold mb-2">Best Sales Source - Service Wise</h2>

            {/* Header Row for Network, Visitors, and Progress */}
            <div className="service-totals-progress ">
                <span className="w-1/4">Service</span>
                <span className="w-1/4 text-center">Totals</span>
                <span className="w-1/2 text-center">Progress</span>
            </div>

            <div className="space-y-4 px-2">
                {trafficData.map(({ services, totals, color }) => (
                    <div key={services} className="space-y-2 ">
                        <div className="flex items-center justify-between space-x-4">
                            <span className="service-totals ">{services}</span>
                            <span className="service-totals text-center">{totals.toLocaleString()}</span>

                            {/* Progress Bar */}
                            <div className="w-1/2 bg-gray-300 rounded-full h-[10px]">
                                <div
                                    className={`${color} h-[10px] rounded-full`}
                                    style={{ width: `${(totals / maxVisitors) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Divider Line */}
                        <hr className="border-gray-300 mt-[]2px" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BestTrafficSource;
