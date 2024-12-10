import React from 'react'
import Card from './cardui';

export default function CardApi() {

    const graphData1 = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        data: [5, 15, 20, 10, 30, 30, 40, 70, 80, 90, 20, 30],
    };

    const graphData2 = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        data: [25, 10, 15, 30, 40, 30, 40, 70, 50, 20, 60, 80, 20],
    };
    return (
        <>
            <div className='flex flex-wrap justify-center md:justify-center lg:justify-start gap-[12px] pt-10'>
                <Card
                    title="Total Transactions"
                    volume="15.3k"
                    percent={5}
                    graphData={graphData2} />
                <Card
                    title="Total Success Transactions"
                    volume="15.3k"
                    percent={5}
                    graphData={graphData1}
                />
                <Card
                    title="Total Failed Transactions"
                    volume="15.3k"
                    percent={5}
                    graphData={graphData2} />
                <Card
                    title="Today's Transactions Revenue"
                    volume="15.3k"
                    percent={5}
                    graphData={graphData1}
                />
            </div>
        </>
    )
}
