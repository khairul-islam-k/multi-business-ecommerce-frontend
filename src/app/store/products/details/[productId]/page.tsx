import ViewFashionProduct from '@/app/templates/fashion/pages/view-product';
import React from 'react';

const ProductView = () => {

    const site = {
        name: "Onecomm Store",
        templateName: "fashion",
        logo: "https://placehold.co/200x80/png?text=Onecomm+Store",
    };

    if (site.templateName === 'fashion') {
        return <ViewFashionProduct />
    }

};

export default ProductView;