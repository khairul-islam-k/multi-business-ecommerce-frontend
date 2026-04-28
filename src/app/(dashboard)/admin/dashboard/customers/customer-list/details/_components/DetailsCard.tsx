import { DollarOutlined, RollbackOutlined, TeamOutlined } from '@ant-design/icons';
import { Card, Grid, theme } from 'antd';
import React from 'react';

export type Customer = {
  id: number;
  customer: string;
  contact: string;
  email: string;
  city: string;
  source: string;
  orders: number;
  spent: string;
  status: "Active" | "Inactive";
};

const DetailsCard = ({userData}: {userData: Customer}) => {
    const { token } = theme.useToken();
    const screens = Grid.useBreakpoint();

    return (
        <div style={{
                    display: 'grid',
                    gridTemplateColumns: screens.xs ? 'repeat(1, 1fr)' : 'repeat(3, 1fr)',
                    gap: '10px',
                    marginBottom: '10px'
                }}>
                    <Card>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                background: token.colorBgContainerDisabled,
                                height: '50px',
                                width: '50px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '10px'
                            }}>
                                <TeamOutlined style={{ fontSize: '30px' }} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '20px' }}>{userData.orders}</h3>
                                <p>Total Orders</p>
                            </div>
                        </div>
                    </Card>
        
        
                    <Card>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                background: token.colorBgContainerDisabled,
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
                                <h3 style={{ fontSize: '20px' }}>{userData.spent}</h3>
                                <p>Total Spent</p>
                            </div>
                        </div>
                    </Card>
        
                    <Card>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                background: token.colorBgContainerDisabled,
                                height: '50px',
                                width: '50px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '10px'
                            }}>
                                <RollbackOutlined style={{ fontSize: '30px' }} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '20px', marginBottom: '!0' }}
                                // className='mb-0!'
                                >2</h3>
                                <p>Returns</p>
                            </div>
                        </div>
                    </Card>
        
        
                </div>
    );
};

export default DetailsCard;