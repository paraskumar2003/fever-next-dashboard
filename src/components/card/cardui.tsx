
'use client';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, ChartOptions, TooltipItem } from 'chart.js';
import { FaArrowUp } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);


interface GraphCardProps {
    title: string;
    volume: string;
    percent: number;
    graphData: {
        labels: string[];
        data: number[];
    };
}
const Card: React.FC<GraphCardProps> = ({ title, volume, percent, graphData }) => {
    const data = {
        labels: graphData.labels,
        datasets: [
            {
                label: title,
                data: graphData.data,
                // backgroundColor: '#537AEF',
                backgroundColor: "#6F4685",
                borderRadius: 6,
                barPercentage: 0.5,
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                intersect: false,
                mode: 'nearest',
                callbacks: {
                    label: (tooltipItem: TooltipItem<'bar'>) => `Active Users: ${tooltipItem.raw}`,
                },
                backgroundColor: '#333',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 10,
                borderColor: '#3B82F6',
                borderWidth: 1,
                cornerRadius: 8,
            },
        },
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 w-full sm:w-full lg:w-[24%] h-40">
            <div className="flex items-center justify-between">
                <span className="text-gray-500 text-[12px]">{title}</span>
                <div className="flex items-center font-medium text-green-500 text-sm">
                    <span>{`${percent}%`}</span>
                    <FaArrowUp className="ml-1" />
                </div>
            </div>
            <div className="text-lg font-bold my-2">{volume}</div>
            {/* <div className="text-2xl font-bold my-1">{volume}</div> */}

            <div className='h-12'>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default Card;
