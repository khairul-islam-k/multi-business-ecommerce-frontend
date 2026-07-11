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

  if (res?.data?.data?.template === "FASHION") {
    return <FashionTermCondition />;
  }
};

export default TermCondition;