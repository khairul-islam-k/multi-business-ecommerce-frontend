'use client';
import { theme, Typography } from 'antd';
import React from 'react';
import { motion } from "framer-motion";

const AboutPage = () => {
    const { Text } = Typography;
    const {token} = theme.useToken();
    return (
        <div style={{
            paddingTop: '20px',
            paddingBottom: '20px',
            maxWidth: '1200px',
            marginLeft: 'auto',
            marginRight: 'auto',
            color: token.colorTextHeading,
            paddingLeft: '8px',
            paddingRight: '8px'

        }}>
            <div style={{ textAlign: 'center' }}>
                <Text style={{ color: 'orange' }}>About Us</Text>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>Empowering merchants worldwide</h3>
                <p>Founded in 2020, OneComm has helped over 50,000 businesses launch and grow their online presence.</p>
            </div>

            {/* about card */}
            <section className='grid lg:grid-cols-2 grid-cols-1 gap-4'>
                <motion.div
                    animate={{
                        background: [
                            "linear-gradient(90deg, #ff0080, #7928ca)",
                            "linear-gradient(90deg, #7928ca, #00ffcc)",
                            "linear-gradient(90deg, #00ffcc, #ff0080)"
                        ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}

                    className='rounded-xl w-[500px] h-[400px] hidden md:block'
                >
                </motion.div>

                <div>
                    <h3 style={{fontSize: '24px',
                        fontWeight: 'bold'
                    }}>Our Story</h3>
                    <p>We started OneComm because we believed selling online should be simple, affordable, and beautiful. Our platform combines powerful technology with intuitive design to help anyone build a successful online store.

                        Today, we serve merchants in 120+ countries and process over $2B in annual transactions.</p>
                </div>
            </section>

        </div>
    );
};

export default AboutPage;