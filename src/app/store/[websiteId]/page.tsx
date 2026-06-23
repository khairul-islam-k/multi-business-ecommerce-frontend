import ElectronicHomePage from '@/app/templates/electronic/pages/home-page';
import FashionHomePage from '@/app/templates/fashion/pages/home-page';
import React from 'react';

type Props = {
  params: Promise<{
    store: string;
  }>;
};

const Homepage = async ({ params }: Props) => {
  const { store } = await params;
  console.log('params', store);

  const site = {
    name: "Onecomm Store",
    templateName: "fashion",
    logo: "https://placehold.co/200x80/png?text=Onecomm+Store",
    store,
  };

  if (site.templateName === "electronic") {
    return <ElectronicHomePage site={site} />;
  }

  if (site.templateName === "fashion") {
    return <FashionHomePage site={site} />;
  }
  
};

export default Homepage;