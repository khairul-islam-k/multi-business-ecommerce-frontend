"use client";
import React from 'react';
import product_1 from '@/assets/animate-product/botle.png';
import product_2 from '@/assets/animate-product/bug.png';
import product_3 from '@/assets/animate-product/clock.png';
import product_4 from '@/assets/animate-product/parfum.png';
import product_5 from '@/assets/animate-product/shoes.png';
import product_6 from '@/assets/animate-product/sit.png';
import product_7 from '@/assets/animate-product/sunglass.png';
import { motion } from "framer-motion";
import { Grid, theme } from 'antd';

const AnimatedProduct = () => {
    const {token} = theme.useToken();
    const screens = Grid.useBreakpoint();

    return (
        <div>
            <div
            style={{
                background: token.colorPrimary,
                display: screens.xs ? 'none': 'block'
            }}
            className='banner'>
                <motion.h1
                style={{fontSize: '48px', fontWeight: 'bold', marginTop: '30px'}}
                animate={{
                    color: ["#9c1aff", "#7700ff", "#ff008c", "#FAFC6D", "#EDF01D", "#64F250", "#38ED1C"]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                }}
                >Start Your Business</motion.h1>

                <div style={{ '--quantity': 7 } as React.CSSProperties} className='slider'>

                    <div style={{ '--position': 1 } as React.CSSProperties} className='item'>
                        <img src={product_1.src} />
                    </div>

                    <div style={{ '--position': 2 } as React.CSSProperties} className='item'>
                        <img src={product_6.src} />
                    </div>

                    <div style={{ '--position': 3 } as React.CSSProperties} className='item'>
                        <img src={product_2.src} />
                    </div>

                    <div style={{ '--position': 4 } as React.CSSProperties} className='item'>
                        <img src={product_3.src} />
                    </div>

                    <div style={{ '--position': 5 } as React.CSSProperties} className='item'>
                        <img src={product_4.src} />
                    </div>

                    <div style={{ '--position': 6 } as React.CSSProperties} className='item'>
                        <img src={product_5.src} />
                    </div>

                    <div style={{ '--position': 7 } as React.CSSProperties} className='item'>
                        <img src={product_7.src} />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AnimatedProduct;