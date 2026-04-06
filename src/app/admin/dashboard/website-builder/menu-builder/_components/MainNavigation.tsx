import { useState } from "react";
import { Card, List, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export interface MenuItem {
    id: number;
    nav: string;
    slug: string;
    children?: MenuItem[];
}

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

const MainNavigation = () => {
    const [menu, setMenu] = useState<MenuItem[]>(initialMenuData);

    const handleDelete = (id: number, parentId?: number) => {
        if (parentId) {
            setMenu((prev) =>
                prev.map((item) =>
                    item.id === parentId
                        ? { ...item, children: item.children?.filter((c) => c.id !== id) }
                        : item
                )
            );
        } else {
            setMenu((prev) => prev.filter((item) => item.id !== id));
        }
    };

    const renderMenu = (items: MenuItem[], parentId?: number) => (
        <List
            dataSource={items}
            renderItem={(item) => (
                <List.Item
                    actions={[
                        <span className="text-gray-500">{item.slug}</span>,
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => handleDelete(item.id, parentId)}
                        />,
                    ]}
                >
                    <List.Item.Meta title={item.nav} />
                    {item.children && renderMenu(item.children, item.id)}
                </List.Item>
            )}
        />
    );

    return (
        <Card title="Menu Items" style={{ maxWidth: 600, margin: "20px auto" }}>
            {renderMenu(menu)}
        </Card>
    );
};

export default MainNavigation;