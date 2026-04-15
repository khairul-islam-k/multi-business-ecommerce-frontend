"use client";
import React from 'react';
import { motion } from "framer-motion";
import Image from "next/image";
import earth from "@/assets/earth.png"
import { Grid, theme, Typography } from 'antd';

const BlazingFast = () => {
    const { Title } = Typography;
    const screens = Grid.useBreakpoint();
    const { token } = theme.useToken();

    return (
        <div style={{
            background: token.colorPrimary,
            color: token.colorWhite
        }}>
            <div
                style={{
                    maxWidth: '1200px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    paddingTop: '100px',
                    display: 'flex',
                    flexDirection: screens.xs ? 'column' : 'row',
                    alignItems: 'center',
                }}
            >

                <div
                    style={{
                        textAlign: 'center'
                    }}
                >
                    <Title
                    style={{
                        color: token.colorWhite
                    }}
                    >Rock steady and <br /> blazing fast</Title>
                    <p>Onecomm puts your store within 30 milliseconds of every shopper on the planet, with the <br /> capacity to handle even the most epic product drops.</p>
                </div>

                <div className="world">
                    <Image src={earth} height={600} width={600} alt='earth' />
                </div>

            </div>
        </div>
    );
};

export default BlazingFast;