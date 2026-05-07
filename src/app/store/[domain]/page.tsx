import ElectronicHomePage from '@/app/templates/electronic/pages/home-page';
import React from 'react';

type Props = {
  params: Promise<{
    domain: string;
  }>;
};

const Homepage = async ({ params }: Props) => {
  const { domain } = await params;
  console.log('params', domain);

  const site = {
    name: "Onecomm Store",
    templateName: "electronic",
    logo: "https://placehold.co/200x80/png?text=Onecomm+Store",
    domain,
  };

  if (site.templateName === "electronic") {
    return <ElectronicHomePage site={site} />;
  }
};

export default Homepage;