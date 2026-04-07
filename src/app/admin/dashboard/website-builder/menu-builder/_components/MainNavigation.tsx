import { DeleteOutlined } from '@ant-design/icons';
import { Card, Flex, theme, Typography } from 'antd';
import React from 'react';

interface MenuItem {
    id: number;
    nav: string;
    slug: string;
    children?: MenuItem[];
}

const { Text } = Typography;

const MainNavigation = () => {
    const { token } = theme.useToken();

    const initialMenuData: MenuItem[] = [
        { id: 1, nav: "Home", slug: "/" },
        {
            id: 2,
            nav: "Products",
            slug: "/Products",
            children: [
                { id: 1, nav: "New Arrivals", slug: "/products/new" },
                { id: 2, nav: "Sale", slug: "/products/sale" },
            ],
        },
        { id: 3, nav: "About", slug: "/about" },
        { id: 4, nav: "Contact", slug: "/contact" },
    ];

    return (
        <div>
            <Card>
                {
                    initialMenuData.map(item => {

                        if (!item.children) {
                            return (
                                <div key={item.id}>
                                    <Card style={{marginBottom: '8px'}}>
                                        <Flex justify='space-between'>
                                            <h3 style={{ fontSize: '17px' }}>{item.nav}</h3>

                                            <div>
                                                <Text>{item.slug}</Text>
                                                <DeleteOutlined style={{
                                                    color: token.colorErrorActive,
                                                    marginLeft: '8px',
                                                }} />
                                            </div>
                                        </Flex>
                                    </Card>
                                </div>
                            )
                        }

                        // with child
                        return (
                            <div key={item.id}>

                                {/* parent */}
                                <Card style={{marginBottom: '8px'}}>
                                    <Flex justify='space-between'>
                                        <h3 style={{ fontSize: '17px' }}>{item.nav}</h3>

                                        <div>
                                            <Text>{item.slug}</Text>
                                            <DeleteOutlined style={{
                                                color: token.colorErrorActive,
                                                marginLeft: '8px',
                                            }} />
                                        </div>
                                    </Flex>
                                </Card>

                                {/* child */}
                                <div>
                                    {
                                        item.children.map(child => {
                                            return <div key={child.id}>
                                                <Card style={{marginLeft: '20px',
                                                    marginBottom: '8px'
                                                }}>
                                                    <Flex justify='space-between'>
                                                        <h3 style={{ fontSize: '17px' }}>{child.nav}</h3>

                                                        <div>
                                                            <Text>{child.slug}</Text>
                                                            <DeleteOutlined style={{
                                                                color: token.colorErrorActive,
                                                                marginLeft: '8px',
                                                            }} />
                                                        </div>
                                                    </Flex>
                                                </Card>
                                            </div>
                                        })
                                    }
                                </div>

                            </div>
                        )


                    })
                }
            </Card>
        </div>
    );
};

export default MainNavigation;