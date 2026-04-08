"use client";
import React from 'react';
import backgroundImage from '@/assets/background-dem.jpg';
import { Button, Grid, theme } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const DemoWebsite = () => {
    const {token} = theme.useToken();
    const screens = Grid.useBreakpoint();
    return (
        <div style={{
            backgroundImage: `url(${backgroundImage.src})`,
            maxWidth: '1200px',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '40px',
            color: token.colorWhite,
            borderRadius: '8px',
            paddingTop: screens.xs ? '50px': '100px',
            paddingBottom: screens.xs ? '50px': '100px'
        }}>
            <h3 style={{
                textAlign: 'center',
                fontSize: '30px',
                fontWeight: 'bold'
            }}>Explore the Full Demo and <br /> Discover What`s Possible</h3>
            <p style={{
                textAlign: 'center'
            }}>Step inside the Zatiq experience and 
                <br />
                 preview how your store will look, function, and grow — before you even start</p>

                 <div style={{
                    textAlign: 'center'
                 }}>
                    <Button
                    icon={<ArrowRightOutlined />}
                    >Explore Demo</Button>
                 </div>
        </div>
    );
};

export default DemoWebsite;