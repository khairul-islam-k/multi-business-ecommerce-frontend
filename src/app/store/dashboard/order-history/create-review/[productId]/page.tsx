import ProductReviewForm from "@/app/templates/fashion/_components/product_review_form";

type CreateReviewPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

const CreateReview = async ({ params }: CreateReviewPageProps) => {
  const { productId } = await params;

  return (
    <div>
        <ProductReviewForm
        productId={productId}
      />
    </div>
  );
};

export default CreateReview;