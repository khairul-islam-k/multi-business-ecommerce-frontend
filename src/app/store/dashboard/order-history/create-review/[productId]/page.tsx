import ProductReviewForm from "@/app/templates/fashion/_components/product_review_form";
import { publicApi } from "@/lib/axios";
import { headers } from "next/headers";

type CreateReviewPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

const CreateReview = async ({ params }: CreateReviewPageProps) => {
  const { productId } = await params;

  const header = await headers()

  const res = await publicApi.get('/storefront/resolve', {
    headers: {
      host: header.get('host') || ""
    }
  })

  console.log('review', res.data.data.businessId)

  return (
    <div>
      <ProductReviewForm
        productId={productId}
        businessId={res.data.data.businessId}
      />
    </div>
  );
};

export default CreateReview;