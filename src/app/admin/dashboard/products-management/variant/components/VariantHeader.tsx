import { DollarOutlined, ShoppingCartOutlined, WarningOutlined } from '@ant-design/icons';
import { Card, Grid, theme } from 'antd';
import React from 'react';

const VariantHeader = () => {
    const {token} = theme.useToken();
    const screens = Grid.useBreakpoint();
    return (
        <div style={{display: 'grid',
            gridTemplateColumns: screens.xs? 'repeat(1, 1fr)': 'repeat(3, 1fr)',
            gap: '10px',
            marginBottom: '10px'
        }}>
            <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{background: token.colorBgContainerDisabled,
                        height: '50px',
                        width: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '10px'
                    }}>
                        <ShoppingCartOutlined style={{ fontSize: '30px' }} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '20px' }}>16</h3>
                        <p>Total Variants</p>
                    </div>
                </div>
            </Card>

            
            <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{background: token.colorBgContainerDisabled,
                        height: '50px',
                        width: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '10px'
                    }}>
                        <DollarOutlined style={{ fontSize: '30px' }} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '20px' }}>14</h3>
                        <p>Active Variants</p>
                    </div>
                </div>
            </Card>

            <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{background: token.colorBgContainerDisabled,
                        height: '50px',
                        width: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '10px'
                    }}>
                        <WarningOutlined style={{ fontSize: '30px' }} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '20px', marginBottom: '!0' }}
                        // className='mb-0!'
                        >7</h3>
                        <p>Low Stock Alert</p>
                    </div>
                </div>
            </Card>


        </div>
    );
};

export default VariantHeader;