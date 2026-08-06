import FashionTermCondition from '@/app/templates/fashion/pages/fashion-term-condition';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

const TermCondition = async () => {
    const header = await headers()

  const res = await publicApi.get('/storefront/resolve', {
    headers: {
      host: header.get('host') || ""
    }
  })

  const terms = res.data.data.config.generalConfig.extraPage.termsAndConditions;

  if (res?.data?.data?.template === "FASHION") {
    return <FashionTermCondition terms={terms} />;
  }

  if (res?.data?.data?.template === "FURNITURE") {
    return <FashionTermCondition terms={terms} />;
  }

  if (res?.data?.data?.template === "PHARMACY") {
    return <FashionTermCondition terms={terms} />;
  }

  if (res?.data?.data?.template === "TOY") {
    return <FashionTermCondition terms={terms} />;
  }

  if (res?.data?.data?.template === "SHOES") {
    return <FashionTermCondition terms={terms} />;
  }

  if (res?.data?.data?.template === "VEHICLE") {
    return <FashionTermCondition terms={terms} />;
  }

  if (res?.data?.data?.template === "GROCERY") {
    return <FashionTermCondition terms={terms} />;
  }

  if (res?.data?.data?.template === "COSMETICS") {
    return <FashionTermCondition terms={terms} />;
  }

  if (res?.data?.data?.template === "RESTAURANT") {
    return <FashionTermCondition terms={terms} />;
  }

  if (res?.data?.data?.template === "ELECTRONIC") {
    return <FashionTermCondition terms={terms} />;
  }
};

export default TermCondition;