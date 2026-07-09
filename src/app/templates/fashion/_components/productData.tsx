import product_1 from '@/assets/fashion/products/product-1.jpg';
import product_2 from '@/assets/fashion/products/product-2.jpg';
import product_3 from '@/assets/fashion/products/product-3.jpg';
import product_4 from '@/assets/fashion/products/product-4.jpg';
import product_5 from '@/assets/fashion/products/product-5.jpg';
import product_6 from '@/assets/fashion/products/product-6.jpg';
import product_7 from '@/assets/fashion/products/product-7.jpg';
import product_8 from '@/assets/fashion/products/product-8.jpg';
import product_9 from '@/assets/fashion/products/product-9.jpg';
import product_10 from '@/assets/fashion/products/product-10.jpg';
import product_11 from '@/assets/fashion/products/product-11.jpg';
import product_12 from '@/assets/fashion/products/product-12.jpg';
import product_13 from '@/assets/fashion/products/product-13.jpg';
import product_14 from '@/assets/fashion/products/women-tops-1.png';
import product_15 from '@/assets/fashion/products/men-top-1.png';
import product_16 from '@/assets/fashion/products/men-top-2.png';
import product_17 from '@/assets/fashion/products/women-top-2.png';
import product_18 from '@/assets/fashion/products/women-top-3.png';
import product_19 from '@/assets/fashion/products/men-top-3.jpg';
import product_20 from '@/assets/fashion/products/men-top-4.jpg';
import product_21 from '@/assets/fashion/products/mens-hoodi.png';

import quality from '@/assets/fashion/policy-label/quality.png';
import support from '@/assets/fashion/policy-label/support.png';
import money from '@/assets/fashion/policy-label/money.png';
import shop from '@/assets/fashion/policy-label/shop.png';



export const allProducts = [
    {
        id: "product-1",
        categoryId: "906334a0-7d01-4f57-8df8-0fa89a4fcac8",
        name: "Classic Denim Jacket",
        slug: "classic-denim-jacket",
        description: "Stylish denim jacket for everyday fashion.",
        price: "1350",
        status: "ACTIVE",
        tag: {
            id: 1,
            name: "NEW ARRIVAL",
        },
        images: [
            {
                id: "product-1-image-1",
                imageUrl: product_1,
                altText: "Classic Denim Jacket",
                isThumbnail: true,
                sortOrder: 0,
            },
        ],
        variants: [
            {
                id: "product-1-variant-1",
                title: "Black M",
                sku: "SKU-PRODUCT-1-BLACK-M",
                price: "1350",
                status: "ACTIVE",
                images: [
                    {
                        id: "product-1-variant-image-1",
                        imageUrl: product_1,
                        altText: "Classic Denim Jacket Black M",
                        isThumbnail: true,
                        sortOrder: 0,
                    },
                ],
            },
        ],
        stockSummary: {
            totalQuantity: "110",
            quantityReserved: "0",
            availableQuantity: "110",
            inStock: true,
        },
        reviewSummary: {
            reviewCount: 1,
            averageRating: 5,
        },
    },
    {
        id: "product-2",
        categoryId: "1d89ed6e-cdde-4896-a664-56f5bb88fb60",
        name: "Casual Cotton Shirt",
        slug: "casual-cotton-shirt",
        description: "Comfortable cotton shirt for casual wear.",
        price: "1500",
        status: "ACTIVE",
        tag: {
            id: 2,
            name: "TRENDING",
        },
        images: [
            {
                id: "product-2-image-1",
                imageUrl: product_2,
                altText: "Casual Cotton Shirt",
                isThumbnail: true,
                sortOrder: 0,
            },
        ],
        variants: [
            {
                id: "product-2-variant-1",
                title: "White L",
                sku: "SKU-PRODUCT-2-WHITE-L",
                price: "1500",
                status: "ACTIVE",
                images: [
                    {
                        id: "product-2-variant-image-1",
                        imageUrl: product_2,
                        altText: "Casual Cotton Shirt White L",
                        isThumbnail: true,
                        sortOrder: 0,
                    },
                ],
            },
        ],
        stockSummary: {
            totalQuantity: "120",
            quantityReserved: "0",
            availableQuantity: "120",
            inStock: true,
        },
        reviewSummary: {
            reviewCount: 2,
            averageRating: 4,
        },
    },
    {
        id: "product-3",
        categoryId: "906334a0-7d01-4f57-8df8-0fa89a4fcac8",
        name: "Slim Fit T-Shirt",
        slug: "slim-fit-t-shirt",
        description: "Modern slim fit t-shirt for daily wear.",
        price: "1650",
        status: "ACTIVE",
        tag: {
            id: 3,
            name: "BEST SELLING",
        },
        images: [
            {
                id: "product-3-image-1",
                imageUrl: product_3,
                altText: "Slim Fit T-Shirt",
                isThumbnail: true,
                sortOrder: 0,
            },
        ],
        variants: [
            {
                id: "product-3-variant-1",
                title: "Blue M",
                sku: "SKU-PRODUCT-3-BLUE-M",
                price: "1650",
                status: "ACTIVE",
                images: [
                    {
                        id: "product-3-variant-image-1",
                        imageUrl: product_3,
                        altText: "Slim Fit T-Shirt Blue M",
                        isThumbnail: true,
                        sortOrder: 0,
                    },
                ],
            },
        ],
        stockSummary: {
            totalQuantity: "130",
            quantityReserved: "0",
            availableQuantity: "130",
            inStock: true,
        },
        reviewSummary: {
            reviewCount: 3,
            averageRating: 5,
        },
    },
    {
        id: "product-4",
        categoryId: "1d89ed6e-cdde-4896-a664-56f5bb88fb60",
        name: "Premium Polo Shirt",
        slug: "premium-polo-shirt",
        description: "Premium polo shirt with soft fabric.",
        price: "1800",
        status: "ACTIVE",
        tag: {
            id: 4,
            name: "POPULAR",
        },
        images: [
            {
                id: "product-4-image-1",
                imageUrl: product_4,
                altText: "Premium Polo Shirt",
                isThumbnail: true,
                sortOrder: 0,
            },
        ],
        variants: [
            {
                id: "product-4-variant-1",
                title: "Green L",
                sku: "SKU-PRODUCT-4-GREEN-L",
                price: "1800",
                status: "ACTIVE",
                images: [
                    {
                        id: "product-4-variant-image-1",
                        imageUrl: product_4,
                        altText: "Premium Polo Shirt Green L",
                        isThumbnail: true,
                        sortOrder: 0,
                    },
                ],
            },
        ],
        stockSummary: {
            totalQuantity: "140",
            quantityReserved: "0",
            availableQuantity: "140",
            inStock: true,
        },
        reviewSummary: {
            reviewCount: 4,
            averageRating: 4,
        },
    },
    {
        id: "product-5",
        categoryId: "1d89ed6e-cdde-4896-a664-56f5bb88fb60",
        name: "Men's Formal Pant",
        slug: "mens-formal-pant",
        description: "Formal pant for office and events.",
        price: "1950",
        status: "ACTIVE",
        tag: {
            id: 1,
            name: "NEW ARRIVAL",
        },
        images: [
            {
                id: "product-5-image-1",
                imageUrl: product_5,
                altText: "Men's Formal Pant",
                isThumbnail: true,
                sortOrder: 0,
            },
        ],
        variants: [
            {
                id: "product-5-variant-1",
                title: "Black 32",
                sku: "SKU-PRODUCT-5-BLACK-32",
                price: "1950",
                status: "ACTIVE",
                images: [
                    {
                        id: "product-5-variant-image-1",
                        imageUrl: product_5,
                        altText: "Men's Formal Pant Black 32",
                        isThumbnail: true,
                        sortOrder: 0,
                    },
                ],
            },
        ],
        stockSummary: {
            totalQuantity: "150",
            quantityReserved: "0",
            availableQuantity: "150",
            inStock: true,
        },
        reviewSummary: {
            reviewCount: 5,
            averageRating: 5,
        },
    },
    {
        id: "product-6",
        categoryId: "28935f2a-25ba-4322-a6eb-84fc57331e8c",
        name: "Women's Summer Dress",
        slug: "womens-summer-dress",
        description: "Beautiful summer dress for women.",
        price: "2100",
        status: "ACTIVE",
        tag: {
            id: 2,
            name: "TRENDING",
        },
        images: [
            {
                id: "product-6-image-1",
                imageUrl: product_6,
                altText: "Women's Summer Dress",
                isThumbnail: true,
                sortOrder: 0,
            },
        ],
        variants: [
            {
                id: "product-6-variant-1",
                title: "Red M",
                sku: "SKU-PRODUCT-6-RED-M",
                price: "2100",
                status: "ACTIVE",
                images: [
                    {
                        id: "product-6-variant-image-1",
                        imageUrl: product_6,
                        altText: "Women's Summer Dress Red M",
                        isThumbnail: true,
                        sortOrder: 0,
                    },
                ],
            },
        ],
        stockSummary: {
            totalQuantity: "160",
            quantityReserved: "0",
            availableQuantity: "160",
            inStock: true,
        },
        reviewSummary: {
            reviewCount: 6,
            averageRating: 4,
        },
    },
    {
        id: "product-7",
        categoryId: "295c8s9a-f81e-49df-ad9b-bfe8ae742585",
        name: "Oversized Hoodie",
        slug: "oversized-hoodie",
        description: "Comfortable oversized hoodie for winter.",
        price: "2250",
        status: "ACTIVE",
        tag: {
            id: 3,
            name: "BEST SELLING",
        },
        images: [
            {
                id: "product-7-image-1",
                imageUrl: product_7,
                altText: "Oversized Hoodie",
                isThumbnail: true,
                sortOrder: 0,
            },
        ],
        variants: [
            {
                id: "product-7-variant-1",
                title: "Black XL",
                sku: "SKU-PRODUCT-7-BLACK-XL",
                price: "2250",
                status: "ACTIVE",
                images: [
                    {
                        id: "product-7-variant-image-1",
                        imageUrl: product_7,
                        altText: "Oversized Hoodie Black XL",
                        isThumbnail: true,
                        sortOrder: 0,
                    },
                ],
            },
        ],
        stockSummary: {
            totalQuantity: "170",
            quantityReserved: "0",
            availableQuantity: "170",
            inStock: true,
        },
        reviewSummary: {
            reviewCount: 7,
            averageRating: 5,
        },
    },
    {
        id: "product-8",
        categoryId: "1d89ed6e-cdde-4896-a664-56f5bb88fb60",
        name: "Kids Casual Set",
        slug: "kids-casual-set",
        description: "Casual clothing set for kids.",
        price: "2400",
        status: "ACTIVE",
        tag: {
            id: 4,
            name: "POPULAR",
        },
        images: [
            {
                id: "product-8-image-1",
                imageUrl: product_8,
                altText: "Kids Casual Set",
                isThumbnail: true,
                sortOrder: 0,
            },
        ],
        variants: [
            {
                id: "product-8-variant-1",
                title: "Yellow S",
                sku: "SKU-PRODUCT-8-YELLOW-S",
                price: "2400",
                status: "ACTIVE",
                images: [
                    {
                        id: "product-8-variant-image-1",
                        imageUrl: product_8,
                        altText: "Kids Casual Set Yellow S",
                        isThumbnail: true,
                        sortOrder: 0,
                    },
                ],
            },
        ],
        stockSummary: {
            totalQuantity: "180",
            quantityReserved: "0",
            availableQuantity: "180",
            inStock: true,
        },
        reviewSummary: {
            reviewCount: 8,
            averageRating: 4,
        },
    },
    {
        id: "product-9",
        categoryId: "28935f2a-25ba-4322-a6eb-84fc57331e8c",
        name: "Unisex Sweatshirt",
        slug: "unisex-sweatshirt",
        description: "Soft sweatshirt for men and women.",
        price: "2550",
        status: "ACTIVE",
        tag: {
            id: 1,
            name: "NEW ARRIVAL",
        },
        images: [
            {
                id: "product-9-image-1",
                imageUrl: product_9,
                altText: "Unisex Sweatshirt",
                isThumbnail: true,
                sortOrder: 0,
            },
        ],
        variants: [
            {
                id: "product-9-variant-1",
                title: "Gray L",
                sku: "SKU-PRODUCT-9-GRAY-L",
                price: "2550",
                status: "ACTIVE",
                images: [
                    {
                        id: "product-9-variant-image-1",
                        imageUrl: product_9,
                        altText: "Unisex Sweatshirt Gray L",
                        isThumbnail: true,
                        sortOrder: 0,
                    },
                ],
            },
        ],
        stockSummary: {
            totalQuantity: "190",
            quantityReserved: "0",
            availableQuantity: "190",
            inStock: true,
        },
        reviewSummary: {
            reviewCount: 9,
            averageRating: 5,
        },
    },
    {
        id: "product-10",
        categoryId: "906334a0-7d01-4f57-8df8-0fa89a4fcac8",
        name: "Athletic Joggers",
        slug: "athletic-joggers",
        description: "Flexible joggers for sports and casual use.",
        price: "2700",
        status: "ACTIVE",
        tag: {
            id: 2,
            name: "TRENDING",
        },
        images: [
            {
                id: "product-10-image-1",
                imageUrl: product_10,
                altText: "Athletic Joggers",
                isThumbnail: true,
                sortOrder: 0,
            },
        ],
        variants: [
            {
                id: "product-10-variant-1",
                title: "Black L",
                sku: "SKU-PRODUCT-10-BLACK-L",
                price: "2700",
                status: "ACTIVE",
                images: [
                    {
                        id: "product-10-variant-image-1",
                        imageUrl: product_10,
                        altText: "Athletic Joggers Black L",
                        isThumbnail: true,
                        sortOrder: 0,
                    },
                ],
            },
        ],
        stockSummary: {
            totalQuantity: "200",
            quantityReserved: "0",
            availableQuantity: "200",
            inStock: true,
        },
        reviewSummary: {
            reviewCount: 10,
            averageRating: 4,
        },
    },
    {
        id: "product-11",
        categoryId: "28935f2a-25ba-4322-a6eb-84fc57331e8c",
        name: "Printed T-Shirt",
        slug: "printed-t-shirt",
        description: "Trendy printed t-shirt for casual style.",
        price: "2850",
        status: "ACTIVE",
        tag: {
            id: 3,
            name: "BEST SELLING",
        },
        images: [
            {
                id: "product-11-image-1",
                imageUrl: product_11,
                altText: "Printed T-Shirt",
                isThumbnail: true,
                sortOrder: 0,
            },
        ],
        variants: [
            {
                id: "product-11-variant-1",
                title: "White M",
                sku: "SKU-PRODUCT-11-WHITE-M",
                price: "2850",
                status: "ACTIVE",
                images: [
                    {
                        id: "product-11-variant-image-1",
                        imageUrl: product_11,
                        altText: "Printed T-Shirt White M",
                        isThumbnail: true,
                        sortOrder: 0,
                    },
                ],
            },
        ],
        stockSummary: {
            totalQuantity: "210",
            quantityReserved: "0",
            availableQuantity: "210",
            inStock: true,
        },
        reviewSummary: {
            reviewCount: 11,
            averageRating: 5,
        },
    },
    {
        id: "product-12",
        categoryId: "295c8s9a-f81e-49df-ad9b-bfe8ae742585",
        name: "Women Fashion Top",
        slug: "women-fashion-top",
        description: "Stylish fashion top for women.",
        price: "3000",
        status: "ACTIVE",
        tag: {
            id: 4,
            name: "POPULAR",
        },
        images: [
            {
                id: "product-12-image-1",
                imageUrl: product_12,
                altText: "Women Fashion Top",
                isThumbnail: true,
                sortOrder: 0,
            },
        ],
        variants: [
            {
                id: "product-12-variant-1",
                title: "Pink M",
                sku: "SKU-PRODUCT-12-PINK-M",
                price: "3000",
                status: "ACTIVE",
                images: [
                    {
                        id: "product-12-variant-image-1",
                        imageUrl: product_12,
                        altText: "Women Fashion Top Pink M",
                        isThumbnail: true,
                        sortOrder: 0,
                    },
                ],
            },
        ],
        stockSummary: {
            totalQuantity: "220",
            quantityReserved: "0",
            availableQuantity: "220",
            inStock: true,
        },
        reviewSummary: {
            reviewCount: 12,
            averageRating: 4,
        },
    },
    {
        id: "product-13",
        categoryId: "28935f2a-25ba-4322-a6eb-84fc57331e8c",
        name: "Men Casual Blazer",
        slug: "men-casual-blazer",
        description: "Smart casual blazer for men.",
        price: "3150",
        status: "ACTIVE",
        tag: {
            id: 1,
            name: "NEW ARRIVAL",
        },
        images: [
            {
                id: "product-13-image-1",
                imageUrl: product_13,
                altText: "Men Casual Blazer",
                isThumbnail: true,
                sortOrder: 0,
            },
        ],
        variants: [
            {
                id: "product-13-variant-1",
                title: "Navy L",
                sku: "SKU-PRODUCT-13-NAVY-L",
                price: "3150",
                status: "ACTIVE",
                images: [
                    {
                        id: "product-13-variant-image-1",
                        imageUrl: product_13,
                        altText: "Men Casual Blazer Navy L",
                        isThumbnail: true,
                        sortOrder: 0,
                    },
                ],
            },
        ],
        stockSummary: {
            totalQuantity: "230",
            quantityReserved: "0",
            availableQuantity: "230",
            inStock: true,
        },
        reviewSummary: {
            reviewCount: 13,
            averageRating: 5,
        },
    },
    {
        id: "product-14",
        categoryId: "906334a0-7d01-4f57-8df8-0fa89a4fcac8",
        name: "Women Tops",
        slug: "women-tops",
        description: "Modern women tops for daily wear.",
        price: "3300",
        status: "ACTIVE",
        tag: {
            id: 2,
            name: "TRENDING",
        },
        images: [
            {
                id: "product-14-image-1",
                imageUrl: product_14,
                altText: "Women Tops",
                isThumbnail: true,
                sortOrder: 0,
            },
        ],
        variants: [
            {
                id: "product-14-variant-1",
                title: "Red M",
                sku: "SKU-PRODUCT-14-RED-M",
                price: "3300",
                status: "ACTIVE",
                images: [
                    {
                        id: "product-14-variant-image-1",
                        imageUrl: product_14,
                        altText: "Women Tops Red M",
                        isThumbnail: true,
                        sortOrder: 0,
                    },
                ],
            },
        ],
        stockSummary: {
            totalQuantity: "240",
            quantityReserved: "0",
            availableQuantity: "240",
            inStock: true,
        },
        reviewSummary: {
            reviewCount: 14,
            averageRating: 4,
        },
    },
    {
        id: "product-15",
        categoryId: "295c8s9a-f81e-49df-ad9b-bfe8ae742585",
        name: "Men Basic Top",
        slug: "men-basic-top",
        description: "Simple and comfortable men basic top.",
        price: "3450",
        status: "ACTIVE",
        tag: {
            id: 3,
            name: "BEST SELLING",
        },
        images: [
            {
                id: "product-15-image-1",
                imageUrl: product_15,
                altText: "Men Basic Top",
                isThumbnail: true,
                sortOrder: 0,
            },
        ],
        variants: [
            {
                id: "product-15-variant-1",
                title: "Black M",
                sku: "SKU-PRODUCT-15-BLACK-M",
                price: "3450",
                status: "ACTIVE",
                images: [
                    {
                        id: "product-15-variant-image-1",
                        imageUrl: product_15,
                        altText: "Men Basic Top Black M",
                        isThumbnail: true,
                        sortOrder: 0,
                    },
                ],
            },
        ],
        stockSummary: {
            totalQuantity: "250",
            quantityReserved: "0",
            availableQuantity: "250",
            inStock: true,
        },
        reviewSummary: {
            reviewCount: 15,
            averageRating: 5,
        },
    },
    {
        id: "product-16",
        categoryId: "906334a0-7d01-4f57-8df8-0fa89a4fcac8",
        name: "Men Premium Top",
        slug: "men-premium-top",
        description: "Premium quality men top.",
        price: "3600",
        status: "ACTIVE",
        tag: {
            id: 4,
            name: "POPULAR",
        },
        images: [
            {
                id: "product-16-image-1",
                imageUrl: product_16,
                altText: "Men Premium Top",
                isThumbnail: true,
                sortOrder: 0,
            },
        ],
        variants: [
            {
                id: "product-16-variant-1",
                title: "White L",
                sku: "SKU-PRODUCT-16-WHITE-L",
                price: "3600",
                status: "ACTIVE",
                images: [
                    {
                        id: "product-16-variant-image-1",
                        imageUrl: product_16,
                        altText: "Men Premium Top White L",
                        isThumbnail: true,
                        sortOrder: 0,
                    },
                ],
            },
        ],
        stockSummary: {
            totalQuantity: "260",
            quantityReserved: "0",
            availableQuantity: "260",
            inStock: true,
        },
        reviewSummary: {
            reviewCount: 16,
            averageRating: 4,
        },
    },
    {
        id: "product-17",
        categoryId: "295c8s9a-f81e-49df-ad9b-bfe8ae742585",
        name: "Women Casual Top",
        slug: "women-casual-top",
        description: "Casual top for women.",
        price: "3750",
        status: "ACTIVE",
        tag: {
            id: 1,
            name: "NEW ARRIVAL",
        },
        images: [
            {
                id: "product-17-image-1",
                imageUrl: product_17,
                altText: "Women Casual Top",
                isThumbnail: true,
                sortOrder: 0,
            },
        ],
        variants: [
            {
                id: "product-17-variant-1",
                title: "Pink L",
                sku: "SKU-PRODUCT-17-PINK-L",
                price: "3750",
                status: "ACTIVE",
                images: [
                    {
                        id: "product-17-variant-image-1",
                        imageUrl: product_17,
                        altText: "Women Casual Top Pink L",
                        isThumbnail: true,
                        sortOrder: 0,
                    },
                ],
            },
        ],
        stockSummary: {
            totalQuantity: "270",
            quantityReserved: "0",
            availableQuantity: "270",
            inStock: true,
        },
        reviewSummary: {
            reviewCount: 17,
            averageRating: 5,
        },
    },
    {
        id: "product-18",
        categoryId: "906334a0-7d01-4f57-8df8-0fa89a4fcac8",
        name: "Women Stylish Top",
        slug: "women-stylish-top",
        description: "Stylish top for modern women.",
        price: "3900",
        status: "ACTIVE",
        tag: {
            id: 2,
            name: "TRENDING",
        },
        images: [
            {
                id: "product-18-image-1",
                imageUrl: product_18,
                altText: "Women Stylish Top",
                isThumbnail: true,
                sortOrder: 0,
            },
        ],
        variants: [
            {
                id: "product-18-variant-1",
                title: "Blue M",
                sku: "SKU-PRODUCT-18-BLUE-M",
                price: "3900",
                status: "ACTIVE",
                images: [
                    {
                        id: "product-18-variant-image-1",
                        imageUrl: product_18,
                        altText: "Women Stylish Top Blue M",
                        isThumbnail: true,
                        sortOrder: 0,
                    },
                ],
            },
        ],
        stockSummary: {
            totalQuantity: "280",
            quantityReserved: "0",
            availableQuantity: "280",
            inStock: true,
        },
        reviewSummary: {
            reviewCount: 18,
            averageRating: 4,
        },
    },
    {
        id: "product-19",
        categoryId: "295c8s9a-f81e-49df-ad9b-bfe8ae742585",
        name: "Men Denim Top",
        slug: "men-denim-top",
        description: "Denim top for men.",
        price: "4050",
        status: "ACTIVE",
        tag: {
            id: 3,
            name: "BEST SELLING",
        },
        images: [
            {
                id: "product-19-image-1",
                imageUrl: product_19,
                altText: "Men Denim Top",
                isThumbnail: true,
                sortOrder: 0,
            },
        ],
        variants: [
            {
                id: "product-19-variant-1",
                title: "Denim L",
                sku: "SKU-PRODUCT-19-DENIM-L",
                price: "4050",
                status: "ACTIVE",
                images: [
                    {
                        id: "product-19-variant-image-1",
                        imageUrl: product_19,
                        altText: "Men Denim Top Denim L",
                        isThumbnail: true,
                        sortOrder: 0,
                    },
                ],
            },
        ],
        stockSummary: {
            totalQuantity: "290",
            quantityReserved: "0",
            availableQuantity: "290",
            inStock: true,
        },
        reviewSummary: {
            reviewCount: 19,
            averageRating: 5,
        },
    },
    {
        id: "product-20",
        categoryId: "906334a0-7d01-4f57-8df8-0fa89a4fcac8",
        name: "Men Winter Jacket",
        slug: "men-winter-jacket",
        description: "Warm winter jacket for men.",
        price: "4200",
        status: "ACTIVE",
        tag: {
            id: 4,
            name: "POPULAR",
        },
        images: [
            {
                id: "product-20-image-1",
                imageUrl: product_20,
                altText: "Men Winter Jacket",
                isThumbnail: true,
                sortOrder: 0,
            },
        ],
        variants: [
            {
                id: "product-20-variant-1",
                title: "Brown XL",
                sku: "SKU-PRODUCT-20-BROWN-XL",
                price: "4200",
                status: "ACTIVE",
                images: [
                    {
                        id: "product-20-variant-image-1",
                        imageUrl: product_20,
                        altText: "Men Winter Jacket Brown XL",
                        isThumbnail: true,
                        sortOrder: 0,
                    },
                ],
            },
        ],
        stockSummary: {
            totalQuantity: "300",
            quantityReserved: "0",
            availableQuantity: "300",
            inStock: true,
        },
        reviewSummary: {
            reviewCount: 20,
            averageRating: 4,
        },
    },
    {
        id: "product-21",
        categoryId: "906334a0-7d01-4f57-8df8-0fa89a4fcac8",
        name: "Men's Hoodie",
        slug: "mens-hoodie",
        description: "Comfortable men's hoodie.",
        price: "4350",
        status: "ACTIVE",
        tag: {
            id: 1,
            name: "NEW ARRIVAL",
        },
        images: [
            {
                id: "product-21-image-1",
                imageUrl: product_21,
                altText: "Men's Hoodie",
                isThumbnail: true,
                sortOrder: 0,
            },
        ],
        variants: [
            {
                id: "product-21-variant-1",
                title: "Black XL",
                sku: "SKU-PRODUCT-21-BLACK-XL",
                price: "4350",
                status: "ACTIVE",
                images: [
                    {
                        id: "product-21-variant-image-1",
                        imageUrl: product_21,
                        altText: "Men's Hoodie Black XL",
                        isThumbnail: true,
                        sortOrder: 0,
                    },
                ],
            },
        ],
        stockSummary: {
            totalQuantity: "310",
            quantityReserved: "0",
            availableQuantity: "310",
            inStock: true,
        },
        reviewSummary: {
            reviewCount: 21,
            averageRating: 5,
        },
    },
];

export const policyData = [
    {
        id: '1',
        title: 'Manage Quality',
        description: 'Best Quality Guarantee',
        photo: quality
    },
    {
        id: '2',
        title: 'Win $100 To Shop',
        description: 'Enter Now',
        photo: shop
    },
    {
        id: '3',
        title: 'Best Online Support',
        description: 'Hour: 10:00AM - 5:00PM',
        photo: support
    },
    {
        id: '4',
        title: 'Money Guarantee',
        description: 'With A 30 Days',
        photo: money
    }
];