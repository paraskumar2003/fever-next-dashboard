import React from 'react';
import { Bar } from 'react-chartjs-2';
import TrafficSrc_Ui from '../Sales_Src/salesSrc_Ui';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
    title: string;
    labels: string[];
    data: number[];
    className?: string;
}

const BarChart: React.FC<BarChartProps> = ({ title, labels, data, className }) => {
    const chartData: ChartData<'bar'> = {
        labels,
        datasets: [
            {
                label: title,
                data,
                backgroundColor: '#6F4685',
                hoverBackgroundColor: '#9E7BB5',
                hoverBorderColor: '#9E7BB5',
                borderColor: '#6F4685',
                borderWidth: 1,
                borderRadius: 5,
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: true,
                text: title,
                align: 'start',
                font: {
                    size: 18,
                    weight: 'bold',
                },
                color: '#4a5568',
                padding: {
                    top: 10,
                    bottom: 20,
                },
            },

        },
        scales: {
            y: {
                beginAtZero: true,
                border: {
                    dash: [8, 8]
                }
            },
            x: {
                border: {
                    dash: [8, 8]
                },
                beginAtZero: true,
                // barPercentage: 0.5, // Adjusts the width of the bars relative to available space
                // maxBarThickness: 20, // Maximum thickness of bars on larger screens
            },

        },
    };

    return (
        <div className={`lg:flex-row md:flex-col sm:flex-col flex-col flex gap-3`}>
            <div className={`w-full sm:w-full lg:w-[60%] h-64 sm:h-80 lg:h-96 ${className}`}>
                <Bar data={chartData} options={options} />
            </div>
            <div className="border-2 rounded-[6px] bg-white  w-full sm:w-full lg:w-[40%] h-64 sm:h-80 lg:h-96">
                <TrafficSrc_Ui />
            </div>
        </div>
    );
};

export default BarChart;
