import React from 'react'
import { BsHouseDoor, BsGraphUp, BsFillBarChartFill, BsChartSquare, BsArrowRight } from 'react-icons/bs';
import Card from './Card';

export default function CardList() {
    return (
        <div className="grid grid-cols-4 gap-4 md:grid-cols-1 py-8 text-black w-full" dir='rtl'>
            <Card
                id="1"
                icon={<BsHouseDoor size={69} color='#f584' />}
                title="عدد العقارات"
                value="30"
                label="العدد الاجمالي"
            />

            <Card
                id="2"
                icon={<BsGraphUp size={24} />}
                title="إحصائيات أخرى"
                value="10"
                label="وصف إحصائيات أخرى"
            />
            <Card
                id="3"
                icon={<BsFillBarChartFill size={24} />}
                title="إحصائيات إضافية"
                value="20"
                label="وصف إحصائيات إضافية"
            />
            <Card
                id="4"
                icon={<BsArrowRight size={24} />}
                title="إحصائيات أخيرة"
                value="15"
                label="وصف إحصائيات أخيرة"
            />
        </div>
    )
}
