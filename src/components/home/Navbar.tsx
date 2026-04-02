'use client'
import { useState } from 'react'
import { Menu, Button, Drawer, theme } from 'antd'
import { UserOutlined, MenuOutlined, LoginOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Logo from '../shared/logo'
import ThemeToggle from '../shared/theme-toggle'

const items = [
    { key: 'home', label: <Link href="/">Home</Link> },
    { key: 'pricing', label: <Link href="/pricing">Pricing</Link> },
    { key: 'feature', label: <Link href="/feature">Features</Link> },
    { key: 'about', label: <Link href="/about">About us</Link> },
    { key: 'contact', label: <Link href="/contact">Contact Us</Link> },
];

export default function Navbar() {
    const [drawerVisible, setDrawerVisible] = useState(false)

    const showDrawer = () => setDrawerVisible(true)
    const closeDrawer = () => setDrawerVisible(false)

    const { token } = theme.useToken();


    return (
        <nav
        style={{background: token.colorBgLayout}}
        className="w-full shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between py-2 px-6">

                {/* Logo */}
                <Logo />

                {/* Desktop Menu (center) */}
                <div className="hidden md:flex flex-1 justify-center">
                    <Menu
                        mode="horizontal"
                        items={items}
                        selectable={false}
                        style={{ borderBottom: 'none', background: 'none' }} // removes border
                    />
                </div>

                {/* Right Buttons */}
                <div className="flex items-center space-x-4 gap-2 ">

                    <div className='hidden lg:flex gap-2'>
                        <ThemeToggle></ThemeToggle>

                        {/* User Icon */}
                        <Button type="default" shape="circle" icon={<UserOutlined />} />

                        {/* Contact Button */}
                        <Link href='/admin/sign-in'>
                            <Button type="primary"
                                icon={<LoginOutlined />}
                            >
                                Log in
                            </Button>
                        </Link>
                    </div>

                    {/* Hamburger Menu for Mobile */}
                    <div className="md:hidden">
                        <Button
                            type="default"
                            icon={<MenuOutlined />}
                            onClick={showDrawer}
                        />
                    </div>

                </div>
            </div>

            {/* Mobile Drawer Menu */}
            <Drawer
                title="Menu"
                placement="right"
                onClose={closeDrawer}
                open={drawerVisible}
            // bodyStyle={{ padding: 0 }}
            >
                <Menu
                    mode="vertical"
                    items={items.map(item => ({
                        ...item,
                        onClick: closeDrawer, // close drawer when clicking
                    }))}
                    selectable={false}
                    style={{ border: 'none' }}
                />

                <div >
                    <Button type="default" shape="circle" icon={<UserOutlined />} />

                    {/* Contact Button */}

                    <Link href='/admin/sign-in'>
                            <Button type="primary"
                                icon={<LoginOutlined />}
                            >
                                Log in
                            </Button>
                        </Link>
                </div>

            </Drawer>
        </nav>
    )
}