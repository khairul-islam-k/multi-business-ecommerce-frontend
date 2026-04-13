"use client";
import React from 'react';
import { motion } from "framer-motion";
import Image from "next/image";
import earth from "@/assets/earth.png"
import { Grid, Typography } from 'antd';

const BlazingFast = () => {
    const {Title} = Typography;
    const screens = Grid.useBreakpoint();

    return (
        <div
            style={{
                maxWidth: '1200px',
                marginLeft: 'auto',
                marginRight: 'auto',
                paddingTop: '100px',
                display: 'flex',
                flexDirection: screens.xs? 'column': 'row',
                alignItems: 'center'
            }}
        >

            <div 
            style={{
                textAlign: 'center'
            }}
            >
                <Title
                >Rock steady and <br /> blazing fast</Title>
                <p>Onecomm puts your store within 30 milliseconds of every shopper on the planet, with the <br /> capacity to handle even the most epic product drops.</p>
            </div>

            <div className="world">
                <Image src={earth} height={600} width={600} alt='earth' />
            </div>

        </div>
    );
};

export default BlazingFast;