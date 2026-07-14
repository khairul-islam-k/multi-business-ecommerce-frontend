"use client";
import { imageUrlSet } from '@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url';
import { useResolveWebsite } from '@/lib/api/hooks/template-resolve';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type logoProps = {
    sidebarCollapsed?: boolean;
}

const LogoComponent = ({ sidebarCollapsed }: logoProps) => {

    const { data: resolve } = useResolveWebsite();

    const fullName = resolve?.name ?? "";
    const firstLetter = fullName.trim().charAt(0).toUpperCase() ?? '';

    const logoUrl = resolve?.theme?.logoUrl ?? '';

    return (
        <div>
            {
                logoUrl ? <Link href='/store'>
                    <div className="flex items-center">
                        <Image
                            src={imageUrlSet(logoUrl)}
                            width={200}
                            height={50}
                            alt="logo"
                            className="object-contain w-[200px] h-[45px]"
                        />
                    </div>
                </Link> :

                    <div className="flex items-center">
                        <Link href="/store" className="flex items-center gap-2">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-gray-900 text-white">
                                {firstLetter}
                            </div>

                            {!sidebarCollapsed && (
                                <span className="text-lg font-bold">
                                    {fullName}
                                </span>
                            )}
                        </Link>
                    </div>
            }
        </div>
    );
};

export default LogoComponent;