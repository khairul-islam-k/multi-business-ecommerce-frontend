"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Collapse,
  Form,
  Input,
  Row,
  Segmented,
  Select,
  Space,
  Spin,
  Tabs,
} from "antd";

import ImageSelectModal from "../../../_components/image-select-modal";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import { useWebsiteTemplates } from "@/lib/api/hooks/website";
import {
  BestOfferImage,
  ChefItem,
  HeaderSlide,
  WebsiteTemplatePayload,
} from "@/types/website/website";
import { useSwal } from "@/hooks/use-swal";
import { ImageIcon, Minus, Plus } from "lucide-react";
import { useProductsQuery } from "@/lib/api";
import { imageUrlSet } from "../../../product-catalog/products/_components/image-url";
import { templateFontOptions } from "@/lib/template-fonts";

const { TextArea } = Input;

type ColorInputMode = "picker" | "text";

type TemplateFormValues = WebsiteTemplatePayload;

type WebsiteTemplateFormProps = {
  mode: "create" | "update";
  initialData?: Partial<WebsiteTemplatePayload>;
  isSubmitting?: boolean;
  onSubmit: (payload: WebsiteTemplatePayload) => Promise<void> | void;
};

type OfferType = {
  slug: string | undefined;
  banner: string;
  title?: string;
  subTitle?: string;
}

const toFormValues = (
  data?: Partial<WebsiteTemplatePayload>,
  offerValue?: OfferType[]
): TemplateFormValues => {
  return {
    template: data?.template ?? "FASHION",
    status: data?.status ?? "DRAFT",

    config: {
      headerConfig: {
        slide: data?.config?.headerConfig?.slide?.length
          ? data.config.headerConfig.slide
          : [
            {
              id: Date.now(),
              title: "",
              imageUrl: "",
              subTitle: "",
              buttonText: "",
              description: "",
            },
          ],
      },

      footerConfig: {
        title: data?.config?.footerConfig?.title ?? "",
        email: data?.config?.footerConfig?.email ?? "",
        phone: data?.config?.footerConfig?.phone ?? "",
        copyrightText: data?.config?.footerConfig?.copyrightText ?? "",
        description: data?.config?.footerConfig?.description ?? "",
        address: data?.config?.footerConfig?.address ?? "",

        socialLinks: {
          facebook:
            data?.config?.footerConfig?.socialLinks?.facebook ?? "",
          instagram:
            data?.config?.footerConfig?.socialLinks?.instagram ?? "",
          twitter:
            data?.config?.footerConfig?.socialLinks?.twitter ?? "",
          youtube:
            data?.config?.footerConfig?.socialLinks?.youtube ?? "",
        },
      },

      generalConfig: {
        bestOfferImages: offerValue ? offerValue : [],

        restaurantSection: data?.config?.generalConfig?.restaurantSection,

        ourChef: data?.config?.generalConfig?.ourChef ?? [],

        extraPage: data?.config?.generalConfig?.extraPage ?? {},
        faqs: data?.config?.generalConfig?.faqs ?? [],

        dashboardColors: data?.config?.generalConfig?.dashboardColors ?? {},

        partners: data?.config?.generalConfig?.partners?.length
          ? data.config.generalConfig.partners
          : [],
      },
    },

    theme: {
      primaryColor: data?.theme?.primaryColor ?? "",
      secondaryColor: data?.theme?.secondaryColor ?? "",
      accentColor: data?.theme?.accentColor ?? "",
      fontFamily: data?.theme?.fontFamily ?? templateFontOptions[0].value,
      logoUrl: data?.theme?.logoUrl ?? "",
      faviconUrl: data?.theme?.faviconUrl ?? "",
      customCss: data?.theme?.customCss ?? "",
    },

    seo: {
      metaTitle: data?.seo?.metaTitle ?? "",
      metaDescription: data?.seo?.metaDescription ?? "",
      metaKeywords: data?.seo?.metaKeywords ?? "",
      ogTitle: data?.seo?.ogTitle ?? "",
      ogDescription: data?.seo?.ogDescription ?? "",
      ogImageUrl: data?.seo?.ogImageUrl ?? "",
      canonicalUrl: data?.seo?.canonicalUrl ?? "",
    },
  };
};

type ThemeColorFieldProps = {
  label: string;
  name: string[];
  placeholder?: string;
};

// config color
const ThemeColorField = ({
  label,
  name,
  placeholder = "#020617",
}: ThemeColorFieldProps) => {
  const [mode, setMode] = useState<ColorInputMode>("picker");

  return (
    <Form.Item label={label} >
      <div className="mb-2 flex justify-end">
        <Segmented
          size="small"
          value={mode}
          options={[
            {
              label: "Color",
              value: "picker",
            },
            {
              label: "Text",
              value: "text",
            },
          ]}
          onChange={(value) => setMode(value as ColorInputMode)}
        />
      </div>

      <Form.Item
        name={name}
        noStyle
      >
        <Input
          type={mode === "picker" ? "color" : "text"}
          placeholder={mode === "text" ? placeholder : undefined}
          className={mode === "picker" ? "h-10 cursor-pointer" : ""}
        />
      </Form.Item>
    </Form.Item>
  );
};

export default function WebsiteTemplateForm({
  mode,
  initialData,
  isSubmitting = false,
  onSubmit,
}: WebsiteTemplateFormProps) {
  const [form] = Form.useForm<TemplateFormValues>();
  const businessId = useActiveBusinessId();
  const websiteTemplatesQuery = useWebsiteTemplates(businessId ?? "");

  const {
    data: products,
    isLoading,
  } = useProductsQuery(businessId, {
    inOffer: true
  });


  const offerProducts = useMemo(() => {
    return products?.items ?? [];
  }, [products?.items]);


  const activeOffer = useMemo<OfferType[]>(() => {
    const existingOfferImages =
      initialData?.config?.generalConfig?.bestOfferImages ?? [];

    return offerProducts.map((product) => {
      const matchedOffer = existingOfferImages.find(
        (item) => item.slug === product.slug,
      );

      return {
        slug: product.slug,
        banner: matchedOffer?.banner ?? "",
        title: matchedOffer?.title,
        subTitle: matchedOffer?.subTitle
      };
    });
  }, [
    offerProducts,
    initialData?.config?.generalConfig?.bestOfferImages,
  ]);



  const templateOptions =
    websiteTemplatesQuery.data?.map((template) => ({
      label: template.name,
      value: template.key,
    })) ?? [];

  const swal = useSwal();

  const [slideImageModalOpen, setSlideImageModalOpen] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number | null>(null);

  const [bestOfferImageModalOpen, setBestOfferImageModalOpen] = useState(false);
  const [activeBestOfferIndex, setActiveBestOfferIndex] = useState<
    number | null
  >(null);

  const [partnerImageModalOpen, setPartnerImageModalOpen] = useState(false);
  const [activePartnerIndex, setActivePartnerIndex] = useState<number | null>(
    null,
  );

  const [themeLogoModalOpen, setThemeLogoModalOpen] = useState(false);
  const [themeFaviconModalOpen, setThemeFaviconModalOpen] = useState(false);


  const [restaurantImageModalOpen, setRestaurantImageModalOpen] = useState(false);

  const slides = Form.useWatch(["config", "headerConfig", "slide"], form) as
    | HeaderSlide[]
    | undefined;

  const selectedSlideImage =
    activeSlideIndex !== null ? slides?.[activeSlideIndex]?.imageUrl : "";

  // best offer
  const bestOfferImages = Form.useWatch(
    ["config", "generalConfig", "bestOfferImages", "banner"],
    form,
  ) as BestOfferImage[] | undefined;

  const selectedBestOfferImage =
    activeBestOfferIndex !== null
      ? bestOfferImages?.[activeBestOfferIndex]?.banner
      : "";

  // chef
  const [activeChefIndex, setActiveChefIndex] = useState<number | null>(null);

  const [chefImageModalOpen, setChefImageModalOpen] = useState(false);

  const ourChef = Form.useWatch(
    ["config", "generalConfig", "ourChef"],
    form,
  ) as ChefItem[] | undefined;

  const selectedOurChef =
    activeChefIndex !== null
      ? ourChef?.[activeChefIndex].image : "";

  // restaurant
  const selectRestaurantImage = Form.useWatch(["config",
    "generalConfig", "restaurantSection", "image"], form) as
    | string
    | undefined;

  const partners = Form.useWatch(
    ["config", "generalConfig", "partners"],
    form,
  ) as string[] | undefined;

  const selectedPartnerImage =
    activePartnerIndex !== null ? partners?.[activePartnerIndex] : "";

  const themeLogoUrl = Form.useWatch(["theme", "logoUrl"], form) as
    | string
    | undefined;

  const themeFaviconUrl = Form.useWatch(["theme", "faviconUrl"], form) as
    | string
    | undefined;

  useEffect(() => {
    if (isLoading) {
      return;
    }

    form.setFieldsValue(
      toFormValues(initialData, activeOffer),
    );
  }, [
    form,
    initialData,
    activeOffer,
    isLoading,
  ]);

  const handleFinish = async (values: TemplateFormValues) => {
    const rawPayload: WebsiteTemplatePayload = {
      template: values.template,
      status: values.status,

      config: {
        headerConfig: {
          slide: values.config?.headerConfig?.slide,
        },

        footerConfig: {
          title: values.config?.footerConfig?.title,
          email: values.config?.footerConfig?.email,
          phone: values.config?.footerConfig?.phone,
          copyrightText: values.config?.footerConfig?.copyrightText,
          description: values.config?.footerConfig?.description,
          address: values.config?.footerConfig?.address,

          socialLinks: {
            facebook:
              values.config?.footerConfig?.socialLinks?.facebook,
            instagram:
              values.config?.footerConfig?.socialLinks?.instagram,
            twitter:
              values.config?.footerConfig?.socialLinks?.twitter,
            youtube:
              values.config?.footerConfig?.socialLinks?.youtube,
          },
        },

        generalConfig: {
          bestOfferImages: values.config?.generalConfig?.bestOfferImages,
          partners: values.config?.generalConfig?.partners,

          ourChef: values.config?.generalConfig?.ourChef?.map((chef) => ({
            name: chef.name.trim(),
            image: chef.image.trim(),
          })) ?? [],

          extraPage: {
            about: values.config?.generalConfig?.extraPage?.about,
            termsAndConditions: values.config?.generalConfig?.extraPage?.termsAndConditions
          },
          faqs: values.config?.generalConfig?.faqs?.map((faq) => ({
            question: faq.question?.trim(),
            answer: faq.answer?.trim(),
          })) ?? [],

          restaurantSection: {
            name: values.config?.generalConfig?.restaurantSection?.name ?? '',
            description: values.config?.generalConfig?.restaurantSection?.description ?? '',
            image: values.config?.generalConfig?.restaurantSection?.image ?? ''
          },

          dashboardColors: {
            sidebarBackgroundColor: values.config?.generalConfig?.dashboardColors?.sidebarBackgroundColor,
            sidebarTextColor: values.config?.generalConfig?.dashboardColors?.sidebarTextColor,
            cardColor: values.config?.generalConfig?.dashboardColors?.cardColor,
            navbarColor: values.config?.generalConfig?.dashboardColors?.navbarColor,
            navbarText: values.config?.generalConfig?.dashboardColors?.navbarText,
          }
        },
      },

      theme: {
        primaryColor: values.theme?.primaryColor,
        secondaryColor: values.theme?.secondaryColor,
        accentColor: values.theme?.accentColor,
        fontFamily: values.theme?.fontFamily,
        logoUrl: values.theme?.logoUrl,
        faviconUrl: values.theme?.faviconUrl,
        customCss: values.theme?.customCss,
      },

      seo: {
        metaTitle: values.seo?.metaTitle,
        metaDescription: values.seo?.metaDescription,
        metaKeywords: values.seo?.metaKeywords,
        ogTitle: values.seo?.ogTitle,
        ogDescription: values.seo?.ogDescription,
        ogImageUrl: values.seo?.ogImageUrl,
        canonicalUrl: values.seo?.canonicalUrl,
      },
    };

    const payload = rawPayload;

    await onSubmit(payload);
  };


  //  color toggle state

  const [primaryMode, setPrimaryMode] =
    useState<ColorInputMode>("picker");

  const [secondaryMode, setSecondaryMode] =
    useState<ColorInputMode>("picker");

  const [accentMode, setAccentMode] =
    useState<ColorInputMode>("picker");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFinishFailed = (errorInfo: any) => {
    const firstError = errorInfo.errorFields?.[0]?.errors?.[0];

    if (firstError) {
      swal.error(String(firstError));
    }
  };

  // template watch
  const selectedTemplate = Form.useWatch("template", form);
  const isRestaurantTemplate = selectedTemplate === "RESTAURANT";

  // extra color
  const topbarColor = Form.useWatch(["config",
                                  "generalConfig",
                                  "dashboardColors",
                                  "navbarColor"], form) as
                                  | string
                                  | undefined;

  const topbarText = Form.useWatch(["config",
                                  "generalConfig",
                                  "dashboardColors",
                                  "navbarText"], form) as
                                  | string
                                  | undefined;

  const cardColor = Form.useWatch(["config",
                                  "generalConfig",
                                  "dashboardColors",
                                  "cardColor"], form) as
                                  | string
                                  | undefined;

  return (
    <Card
      title={
        mode === "create"
          ? "Create Website Template"
          : "Update Website Template"
      }
    >
      <Form<TemplateFormValues>
        form={form}
        layout="vertical"
        initialValues={{
          template: "ELECTRONIC",
        }}
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
      >
        <Tabs
          defaultActiveKey="config"
          items={[
            {
              key: "config",
              label: "Config",
              children: (
                <>
                  <Form.Item
                    label="Template"
                    name="template"
                    rules={[
                      {
                        required: true,
                        message: "Please select template.",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select template"
                      loading={websiteTemplatesQuery.isLoading}
                      options={templateOptions}
                    />
                  </Form.Item>

                  {mode === "update" && (
                    <Form.Item
                      label="Status"
                      name="status"
                      rules={[
                        {
                          required: true,
                          message: "Please select website status",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select status"
                        options={[
                          {
                            label: "Draft",
                            value: "DRAFT",
                          },
                          {
                            label: "Archived",
                            value: "ARCHIVED",
                          },
                        ]}
                      />
                    </Form.Item>
                  )}

                  <Collapse
                    accordion
                    className='mb-5'
                    defaultActiveKey={["headerConfig"]}
                    items={[
                      {
                        key: "headerConfig",
                        label: "Header Config",
                        forceRender: true,
                        children: (
                          <Form.Item
                            noStyle
                            shouldUpdate={(previousValues, currentValues) =>
                              previousValues.template !== currentValues.template
                            }
                          >
                            {({ getFieldValue }) => {
                              const selectedTemplate = getFieldValue(
                                "template",
                              ) as string | undefined;

                              const isRestaurantTemplate =
                                selectedTemplate === "RESTAURANT";

                              const showSlideTextFields = [
                                "FASHION",
                                "COSMETICS",
                                "ELECTRONIC",
                                "GROCERY",
                                "FURNITURE",
                                "RESTAURANT",
                              ].includes(selectedTemplate ?? "");

                              return (
                                <Form.List
                                  name={[
                                    "config",
                                    "headerConfig",
                                    "slide",
                                  ]}
                                >
                                  {(fields, { add, remove }) => {
                                    const displayedFields =
                                      isRestaurantTemplate
                                        ? fields.slice(0, 1)
                                        : fields;

                                    return (
                                      <>
                                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                          <div>
                                            <h3 className="mb-1 text-base font-semibold">
                                              {isRestaurantTemplate
                                                ? "Header Slide"
                                                : "Header Slides"}
                                            </h3>

                                            <p className="mb-0 text-sm text-gray-500">
                                              {isRestaurantTemplate
                                                ? "Configure the restaurant header banner."
                                                : "Configure the header slider banners."}
                                            </p>
                                          </div>

                                          {!isRestaurantTemplate && (
                                            <Button
                                              type="dashed"
                                              onClick={() =>
                                                add({
                                                  id: Date.now(),
                                                  title: "",
                                                  imageUrl: "",
                                                  subTitle: "",
                                                  buttonText: "",
                                                  description: "",
                                                })
                                              }
                                            >
                                              Add Slide
                                            </Button>
                                          )}
                                        </div>

                                        {displayedFields.map(
                                          (
                                            { key, name, ...restField },
                                            index,
                                          ) => (
                                            <Collapse
                                              key={key}
                                              className="mb-4"
                                              defaultActiveKey={[
                                                String(index),
                                              ]}
                                              items={[
                                                {
                                                  key: String(index),
                                                  label: `Slide ${index + 1}`,
                                                  forceRender: true,
                                                  children: (
                                                    <Row gutter={[16, 8]}>
                                                      {/* Slide ID */}
                                                      <Form.Item
                                                        {...restField}
                                                        name={[name, "id"]}
                                                        hidden
                                                      >
                                                        <Input />
                                                      </Form.Item>

                                                      {/* Slide image */}
                                                      <Col
                                                        xs={24}
                                                        md={
                                                          showSlideTextFields
                                                            ? 12
                                                            : 24
                                                        }
                                                      >
                                                        <Form.Item
                                                          {...restField}
                                                          label="Slide Image"
                                                          name={[
                                                            name,
                                                            "imageUrl",
                                                          ]}
                                                          rules={[
                                                            {
                                                              required: true,
                                                              message:
                                                                "Please select slide image",
                                                            },
                                                          ]}
                                                        >
                                                          <Input
                                                            readOnly
                                                            placeholder="Select slide image"
                                                            addonAfter={
                                                              <Button
                                                                type="text"
                                                                size="small"
                                                                icon={
                                                                  <ImageIcon className="h-4 w-4" />
                                                                }
                                                                onClick={(
                                                                  event,
                                                                ) => {
                                                                  event.stopPropagation();

                                                                  setActiveSlideIndex(
                                                                    name,
                                                                  );

                                                                  setSlideImageModalOpen(
                                                                    true,
                                                                  );
                                                                }}
                                                              >
                                                                Select
                                                              </Button>
                                                            }
                                                            onClick={() => {
                                                              setActiveSlideIndex(
                                                                name,
                                                              );

                                                              setSlideImageModalOpen(
                                                                true,
                                                              );
                                                            }}
                                                          />
                                                        </Form.Item>
                                                      </Col>

                                                      {/* Slide title */}
                                                      {showSlideTextFields && (
                                                        <Col xs={24} md={12}>
                                                          <Form.Item
                                                            {...restField}
                                                            label="Slide Title"
                                                            name={[
                                                              name,
                                                              "title",
                                                            ]}
                                                            rules={[
                                                              {
                                                                required: true,
                                                                whitespace: true,
                                                                message:
                                                                  "Please enter slide title",
                                                              },
                                                              {
                                                                max: 150,
                                                                message:
                                                                  "Slide title cannot exceed 150 characters",
                                                              },
                                                            ]}
                                                          >
                                                            <Input
                                                              maxLength={150}
                                                              showCount
                                                              placeholder={
                                                                isRestaurantTemplate
                                                                  ? "Delicious Food Delivered Fresh"
                                                                  : "New Fashion Collection"
                                                              }
                                                            />
                                                          </Form.Item>
                                                        </Col>
                                                      )}

                                                      {/* Slide subtitle */}
                                                      {showSlideTextFields && (
                                                        <Col xs={24} md={12}>
                                                          <Form.Item
                                                            {...restField}
                                                            label="Slide Sub Title"
                                                            name={[
                                                              name,
                                                              "subTitle",
                                                            ]}
                                                            rules={[
                                                              {
                                                                required: true,
                                                                whitespace: true,
                                                                message:
                                                                  "Please enter slide sub title",
                                                              },
                                                              {
                                                                max: 250,
                                                                message:
                                                                  "Slide subtitle cannot exceed 250 characters",
                                                              },
                                                            ]}
                                                          >
                                                            <Input
                                                              maxLength={250}
                                                              showCount
                                                              placeholder={
                                                                isRestaurantTemplate
                                                                  ? "Fresh, Hot and Tasty"
                                                                  : "Fresh Styles Arrived"
                                                              }
                                                            />
                                                          </Form.Item>
                                                        </Col>
                                                      )}

                                                      {/* Button text */}
                                                      {showSlideTextFields && (
                                                        <Col xs={24} md={12}>
                                                          <Form.Item
                                                            {...restField}
                                                            label="Button Text"
                                                            name={[
                                                              name,
                                                              "buttonText",
                                                            ]}
                                                            rules={[
                                                              {
                                                                required: true,
                                                                whitespace: true,
                                                                message:
                                                                  "Please enter button text",
                                                              },
                                                              {
                                                                max: 50,
                                                                message:
                                                                  "Button text cannot exceed 50 characters",
                                                              },
                                                            ]}
                                                          >
                                                            <Input
                                                              maxLength={50}
                                                              showCount
                                                              placeholder={
                                                                isRestaurantTemplate
                                                                  ? "Order Now"
                                                                  : "Shop Now"
                                                              }
                                                            />
                                                          </Form.Item>
                                                        </Col>
                                                      )}

                                                      {/* Description */}
                                                      {showSlideTextFields && (
                                                        <Col xs={24}>
                                                          <Form.Item
                                                            {...restField}
                                                            label="Slide Description"
                                                            name={[
                                                              name,
                                                              "description",
                                                            ]}
                                                            rules={[
                                                              {
                                                                required: true,
                                                                whitespace: true,
                                                                message:
                                                                  "Please enter slide description",
                                                              },
                                                              {
                                                                max: 500,
                                                                message:
                                                                  "Description cannot exceed 500 characters",
                                                              },
                                                            ]}
                                                          >
                                                            <TextArea
                                                              rows={4}
                                                              maxLength={500}
                                                              showCount
                                                              placeholder={
                                                                isRestaurantTemplate
                                                                  ? "Enjoy freshly prepared meals made with quality ingredients."
                                                                  : "Find products that match your personality, comfort, and style."
                                                              }
                                                            />
                                                          </Form.Item>
                                                        </Col>
                                                      )}

                                                      {/* Slide image preview */}
                                                      <Col xs={24}>
                                                        <Form.Item
                                                          noStyle
                                                          shouldUpdate={(
                                                            previousValues,
                                                            currentValues,
                                                          ) => {
                                                            const previousImage =
                                                              previousValues
                                                                ?.config
                                                                ?.headerConfig
                                                                ?.slide?.[
                                                                name
                                                              ]?.imageUrl;

                                                            const currentImage =
                                                              currentValues
                                                                ?.config
                                                                ?.headerConfig
                                                                ?.slide?.[
                                                                name
                                                              ]?.imageUrl;

                                                            return (
                                                              previousImage !==
                                                              currentImage
                                                            );
                                                          }}
                                                        >
                                                          {({
                                                            getFieldValue,
                                                          }) => {
                                                            const imageUrl =
                                                              getFieldValue([
                                                                "config",
                                                                "headerConfig",
                                                                "slide",
                                                                name,
                                                                "imageUrl",
                                                              ]) as
                                                              | string
                                                              | undefined;

                                                            if (!imageUrl) {
                                                              return (
                                                                <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
                                                                  <div className="text-center text-gray-500">
                                                                    <ImageIcon className="mx-auto mb-2 h-7 w-7" />

                                                                    <p className="mb-0">
                                                                      No slide
                                                                      image selected
                                                                    </p>
                                                                  </div>
                                                                </div>
                                                              );
                                                            }

                                                            return (
                                                              <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img
                                                                  src={imageUrlSet(
                                                                    imageUrl,
                                                                  )}
                                                                  alt={`Slide ${index + 1}`}
                                                                  className="h-48 w-full object-cover sm:h-64"
                                                                />
                                                              </div>
                                                            );
                                                          }}
                                                        </Form.Item>
                                                      </Col>

                                                      {/* Remove slide */}
                                                      {!isRestaurantTemplate && (
                                                        <Col xs={24}>
                                                          <Button
                                                            danger
                                                            onClick={() =>
                                                              remove(name)
                                                            }
                                                            disabled={
                                                              fields.length === 1
                                                            }
                                                          >
                                                            Remove Slide
                                                          </Button>
                                                        </Col>
                                                      )}
                                                    </Row>
                                                  ),
                                                },
                                              ]}
                                            />
                                          ),
                                        )}

                                        {displayedFields.length === 0 && (
                                          <div className="rounded-md border border-dashed border-gray-300 p-6 text-center">
                                            <ImageIcon className="mx-auto mb-2 h-7 w-7 text-gray-400" />

                                            <p className="mb-3 text-gray-500">
                                              No header slide found.
                                            </p>

                                            <Button
                                              type="dashed"
                                              onClick={() =>
                                                add({
                                                  id: Date.now(),
                                                  title: "",
                                                  imageUrl: "",
                                                  subTitle: "",
                                                  buttonText: "",
                                                  description: "",
                                                })
                                              }
                                            >
                                              Add First Slide
                                            </Button>
                                          </div>
                                        )}
                                      </>
                                    );
                                  }}
                                </Form.List>
                              );
                            }}
                          </Form.Item>
                        ),
                      },

                      {
                        key: "footerConfig",
                        label: "Footer Config",
                        forceRender: true,
                        children: (
                          <Row gutter={16}>
                            <Col xs={24} md={12}>
                              <Form.Item
                                label="Footer Title"
                                name={["config", "footerConfig", "title"]}
                              >
                                <Input placeholder="Acme Store" />
                              </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                              <Form.Item
                                label="Footer Email"
                                name={["config", "footerConfig", "email"]}
                                rules={[
                                  {
                                    type: "email",
                                    message: "Please enter a valid email address",
                                  },
                                ]}
                              >
                                <Input placeholder="support@example.com" />
                              </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                              <Form.Item
                                label="Footer Phone"
                                name={["config", "footerConfig", "phone"]}
                              >
                                <Input placeholder="+880 1700 000000" />
                              </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                              <Form.Item
                                label="Copyright Text"
                                name={["config", "footerConfig", "copyrightText"]}
                              >
                                <Input placeholder="© 2026 Acme Store. All rights reserved." />
                              </Form.Item>
                            </Col>

                            <Col xs={24}>
                              <Form.Item
                                label="Footer Description"
                                name={["config", "footerConfig", "description"]}
                              >
                                <TextArea
                                  rows={3}
                                  placeholder="Your trusted online store for quality products."
                                />
                              </Form.Item>
                            </Col>

                            <Col xs={24}>
                              <Form.Item
                                label="Address"
                                name={["config", "footerConfig", "address"]}
                              >
                                <TextArea rows={2} placeholder="Dhaka, Bangladesh" />
                              </Form.Item>
                            </Col>

                            <Col xs={24}>
                              <h3 className="mb-4 text-base font-semibold">Social Media Links</h3>
                            </Col>

                            <Col xs={24} md={12}>
                              <Form.Item
                                label="Facebook"
                                name={[
                                  "config",
                                  "footerConfig",
                                  "socialLinks",
                                  "facebook",
                                ]}
                                rules={[
                                  {
                                    type: "url",
                                    message: "Please enter a valid Facebook URL",
                                  },
                                ]}
                              >
                                <Input placeholder="https://facebook.com/your-page" />
                              </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                              <Form.Item
                                label="Instagram"
                                name={[
                                  "config",
                                  "footerConfig",
                                  "socialLinks",
                                  "instagram",
                                ]}
                                rules={[
                                  {
                                    type: "url",
                                    message: "Please enter a valid Instagram URL",
                                  },
                                ]}
                              >
                                <Input placeholder="https://instagram.com/your-profile" />
                              </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                              <Form.Item
                                label="Twitter / X"
                                name={[
                                  "config",
                                  "footerConfig",
                                  "socialLinks",
                                  "twitter",
                                ]}
                                rules={[
                                  {
                                    type: "url",
                                    message: "Please enter a valid Twitter or X URL",
                                  },
                                ]}
                              >
                                <Input placeholder="https://x.com/your-profile" />
                              </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                              <Form.Item
                                label="YouTube"
                                name={[
                                  "config",
                                  "footerConfig",
                                  "socialLinks",
                                  "youtube",
                                ]}
                                rules={[
                                  {
                                    type: "url",
                                    message: "Please enter a valid YouTube URL",
                                  },
                                ]}
                              >
                                <Input placeholder="https://youtube.com/@your-channel" />
                              </Form.Item>
                            </Col>
                          </Row>
                        ),
                      },

                      {
                        key: "dashboardColors",
                        label: "Top and Sidebar Color",
                        forceRender: true,
                        children: (
                          <Row gutter={[16, 16]}>
                            <Col xs={24}>
                              <div className="mb-3">
                                <strong>Dashboard Colors</strong>

                                <p className="mb-0 text-sm text-gray-500">
                                  Customize sidebar background, sidebar text, navbar, navbar text,
                                  and card colors.
                                </p>
                              </div>
                            </Col>

                            <Col xs={24} md={8}>
                              <ThemeColorField
                                label="Sidebar Background Color"
                                name={[
                                  "config",
                                  "generalConfig",
                                  "dashboardColors",
                                  "sidebarBackgroundColor",
                                ]}
                                placeholder="#020617 or var(--sidebar-bg)"
                              />
                            </Col>

                            <Col xs={24} md={8}>
                              <ThemeColorField
                                label="Sidebar Text Color"
                                name={[
                                  "config",
                                  "generalConfig",
                                  "dashboardColors",
                                  "sidebarTextColor",
                                ]}
                                placeholder="#ffffff or var(--sidebar-text)"
                              />
                            </Col>

                            <Col xs={24} md={8}>
                              <ThemeColorField
                                label="Card Color"
                                name={[
                                  "config",
                                  "generalConfig",
                                  "dashboardColors",
                                  "cardColor",
                                ]}
                                placeholder="#ffffff or var(--card-color)"
                              />
                            </Col>

                            <Col xs={24} md={8}>
                              <ThemeColorField
                                label="Navbar Color"
                                name={[
                                  "config",
                                  "generalConfig",
                                  "dashboardColors",
                                  "navbarColor",
                                ]}
                                placeholder="#ffffff or var(--navbar-color)"
                              />
                            </Col>

                            <Col xs={24} md={8}>
                              <ThemeColorField
                                label="Navbar Text Color"
                                name={[
                                  "config",
                                  "generalConfig",
                                  "dashboardColors",
                                  "navbarText",
                                ]}
                                placeholder="#0f172a or var(--navbar-text)"
                              />
                            </Col>

                            {/* Live preview */}
                            <Col xs={24}>
                              <Form.Item
                                noStyle
                                shouldUpdate={(previousValues, currentValues) => {
                                  const previousColors =
                                    previousValues?.config?.generalConfig?.dashboardColors;

                                  const currentColors =
                                    currentValues?.config?.generalConfig?.dashboardColors;

                                  return previousColors !== currentColors;
                                }}
                              >
                                {({ getFieldValue }) => {
                                  const dashboardColors =
                                    getFieldValue([
                                      "config",
                                      "generalConfig",
                                      "dashboardColors",
                                    ]) ?? {};

                                  const sidebarBackgroundColor =
                                    dashboardColors.sidebarBackgroundColor || "#020617";

                                  const sidebarTextColor =
                                    dashboardColors.sidebarTextColor || "#ffffff";

                                  const cardColor =
                                    dashboardColors.cardColor || "#ffffff";

                                  const navbarColor =
                                    dashboardColors.navbarColor || "#ffffff";

                                  const navbarText =
                                    dashboardColors.navbarText || "#0f172a";

                                  return (
                                    <div className="mt-2">
                                      <div className="mb-3">
                                        <strong>Dashboard Preview</strong>

                                        <p className="mb-0 text-sm text-gray-500">
                                          Preview how your selected dashboard colors will look.
                                        </p>
                                      </div>

                                      <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-sm">
                                        <div className="flex min-h-[420px]">
                                          {/* Sidebar */}
                                          <aside
                                            className="hidden w-[220px] shrink-0 p-4 sm:block"
                                            style={{
                                              backgroundColor: sidebarBackgroundColor,
                                              color: sidebarTextColor,
                                            }}
                                          >
                                            <div
                                              className="mb-7 flex h-11 items-center rounded-lg px-3 text-base font-bold"
                                              style={{
                                                backgroundColor: "rgba(255,255,255,0.08)",
                                              }}
                                            >
                                              Dashboard
                                            </div>

                                            <div className="space-y-2">
                                              {[
                                                "Overview",
                                                "Products",
                                                "Orders",
                                                "Customers",
                                                "Settings",
                                              ].map((item, index) => (
                                                <div
                                                  key={item}
                                                  className="rounded-lg px-3 py-2.5 text-sm font-medium"
                                                  style={{
                                                    color: sidebarTextColor,
                                                    backgroundColor:
                                                      index === 0
                                                        ? "rgba(255,255,255,0.14)"
                                                        : "transparent",
                                                  }}
                                                >
                                                  {item}
                                                </div>
                                              ))}
                                            </div>
                                          </aside>

                                          {/* Dashboard content */}
                                          <div className="min-w-0 flex-1 bg-gray-100">
                                            {/* Navbar */}
                                            <header
                                              className="flex h-16 items-center justify-between border-b border-black/10 px-4 sm:px-6"
                                              style={{
                                                backgroundColor: navbarColor,
                                                color: navbarText,
                                              }}
                                            >
                                              <div className="flex items-center gap-3">
                                                <div className="grid h-9 w-9 place-items-center rounded-lg border border-current/20 sm:hidden">
                                                  ☰
                                                </div>

                                                <div>
                                                  <div className="font-semibold">
                                                    Dashboard Overview
                                                  </div>

                                                  <div
                                                    className="text-xs"
                                                    style={{
                                                      color: navbarText,
                                                      opacity: 0.7,
                                                    }}
                                                  >
                                                    Welcome back
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="flex items-center gap-3">
                                                <div className="hidden text-sm sm:block">
                                                  Admin User
                                                </div>

                                                <div
                                                  className="grid h-9 w-9 place-items-center rounded-full font-semibold"
                                                  style={{
                                                    backgroundColor: sidebarBackgroundColor,
                                                    color: sidebarTextColor,
                                                  }}
                                                >
                                                  A
                                                </div>
                                              </div>
                                            </header>

                                            {/* Main content */}
                                            <main className="p-4 sm:p-6">
                                              <div className="mb-5">
                                                <h3 className="mb-1 text-lg font-bold text-gray-900">
                                                  Business Summary
                                                </h3>

                                                <p className="mb-0 text-sm text-gray-500">
                                                  Your dashboard color configuration preview.
                                                </p>
                                              </div>

                                              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                {[
                                                  {
                                                    title: "Total Orders",
                                                    value: "1,240",
                                                  },
                                                  {
                                                    title: "Total Revenue",
                                                    value: "$24,850",
                                                  },
                                                  {
                                                    title: "Customers",
                                                    value: "835",
                                                  },
                                                ].map((card) => (
                                                  <div
                                                    key={card.title}
                                                    className="rounded-xl border border-black/10 p-4 shadow-sm"
                                                    style={{
                                                      backgroundColor: cardColor,
                                                    }}
                                                  >
                                                    <p className="mb-2 text-sm text-gray-500">
                                                      {card.title}
                                                    </p>

                                                    <p className="mb-0 text-2xl font-bold text-gray-900">
                                                      {card.value}
                                                    </p>
                                                  </div>
                                                ))}
                                              </div>

                                              <div
                                                className="mt-4 rounded-xl border border-black/10 p-5 shadow-sm"
                                                style={{
                                                  backgroundColor: cardColor,
                                                }}
                                              >
                                                <div className="mb-4 flex items-center justify-between">
                                                  <div>
                                                    <h4 className="mb-1 font-semibold text-gray-900">
                                                      Recent Orders
                                                    </h4>

                                                    <p className="mb-0 text-xs text-gray-500">
                                                      Latest customer orders
                                                    </p>
                                                  </div>

                                                  <button
                                                    type="button"
                                                    className="rounded-md px-3 py-1.5 text-xs font-semibold"
                                                    style={{
                                                      backgroundColor: sidebarBackgroundColor,
                                                      color: sidebarTextColor,
                                                    }}
                                                  >
                                                    View All
                                                  </button>
                                                </div>

                                                <div className="space-y-3">
                                                  {[1, 2, 3].map((item) => (
                                                    <div
                                                      key={item}
                                                      className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-3"
                                                    >
                                                      <div>
                                                        <p className="mb-1 text-sm font-semibold text-gray-900">
                                                          Order #{1000 + item}
                                                        </p>

                                                        <p className="mb-0 text-xs text-gray-500">
                                                          Customer name
                                                        </p>
                                                      </div>

                                                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
                                                        Completed
                                                      </span>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            </main>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Selected color summary */}
                                      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
                                        {[
                                          {
                                            label: "Sidebar",
                                            color: sidebarBackgroundColor,
                                          },
                                          {
                                            label: "Sidebar Text",
                                            color: sidebarTextColor,
                                          },
                                          {
                                            label: "Navbar",
                                            color: navbarColor,
                                          },
                                          {
                                            label: "Navbar Text",
                                            color: navbarText,
                                          },
                                          {
                                            label: "Card",
                                            color: cardColor,
                                          },
                                        ].map((item) => (
                                          <div
                                            key={item.label}
                                            className="rounded-lg border border-gray-200 bg-white p-3"
                                          >
                                            <div
                                              className="mb-2 h-8 w-full rounded-md border border-black/10"
                                              style={{
                                                backgroundColor: item.color,
                                              }}
                                            />

                                            <p className="mb-1 text-xs font-semibold text-gray-700">
                                              {item.label}
                                            </p>

                                            <p className="mb-0 truncate text-xs text-gray-500">
                                              {item.color}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                }}
                              </Form.Item>
                            </Col>
                          </Row>
                        ),
                      },

                      {
                        key: "bestOfferImages",
                        label: "Best Offer Images",
                        forceRender: true,
                        children: (
                          <Form.Item
                            noStyle
                            shouldUpdate={(previousValues, currentValues) =>
                              previousValues.template !==
                              currentValues.template
                            }
                          >
                            {({ getFieldValue }) => {
                              const selectedTemplate = getFieldValue(
                                "template",
                              ) as string | undefined;

                              const showOfferTextFields = [
                                "FURNITURE",
                                "VEHICLE",
                                "COSMETICS",
                                "SHOES",
                                "TOY",
                                "RESTAURANT",
                                "ELECTRONIC",
                              ].includes(selectedTemplate ?? "");

                              return (
                                <div>
                                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                      <h3 className="mb-1 text-base font-semibold">
                                        Best Offer Images
                                      </h3>

                                      <p className="mb-0 text-sm text-gray-500">
                                        Select one banner image for every
                                        offer product.
                                      </p>
                                    </div>

                                    <div className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium">
                                      Total products:{" "}
                                      {offerProducts.length}
                                    </div>
                                  </div>

                                  {isLoading ? (
                                    <div className="flex min-h-40 items-center justify-center">
                                      <Spin />
                                    </div>
                                  ) : offerProducts.length === 0 ? (
                                    <Alert
                                      type="info"
                                      showIcon
                                      message="No offer products found"
                                      description="Enable an offer for at least one product."
                                    />
                                  ) : (
                                    <div className="space-y-4">
                                      {offerProducts.map(
                                        (product, index) => (
                                          <div
                                            key={
                                              product.id ??
                                              `${product.slug}-${index}`
                                            }
                                            className="rounded-lg border border-gray-200 p-4"
                                          >
                                            <div className="mb-4 flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
                                              <div className="min-w-0">
                                                <div className="truncate font-semibold">
                                                  {product.name ??
                                                    `Offer Product ${index + 1}`}
                                                </div>

                                                <div className="text-sm text-gray-500">
                                                  Offer item {index + 1}
                                                </div>
                                              </div>

                                              <div className="shrink-0 rounded-md bg-gray-100 px-3 py-1 text-xs font-medium">
                                                {index + 1} /{" "}
                                                {offerProducts.length}
                                              </div>
                                            </div>

                                            <Row gutter={[16, 8]}>
                                              {/* Product slug */}
                                              <Col xs={24} md={8}>
                                                <Form.Item
                                                  label="Product Slug"
                                                  name={[
                                                    "config",
                                                    "generalConfig",
                                                    "bestOfferImages",
                                                    index,
                                                    "slug",
                                                  ]}
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message:
                                                        "Product slug is required.",
                                                    },
                                                  ]}
                                                >
                                                  <Input
                                                    readOnly
                                                    placeholder="Product slug"
                                                  />
                                                </Form.Item>
                                              </Col>

                                              {/* Banner image */}
                                              <Col xs={24} md={16}>
                                                <Form.Item
                                                  label="Banner Image"
                                                  name={[
                                                    "config",
                                                    "generalConfig",
                                                    "bestOfferImages",
                                                    index,
                                                    "banner",
                                                  ]}
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message:
                                                        "Please select a banner image.",
                                                    },
                                                  ]}
                                                >
                                                  <Input
                                                    readOnly
                                                    placeholder="Select banner image"
                                                    addonAfter={
                                                      <Button
                                                        type="text"
                                                        size="small"
                                                        icon={
                                                          <ImageIcon className="h-4 w-4" />
                                                        }
                                                        onClick={(event) => {
                                                          event.stopPropagation();

                                                          setActiveBestOfferIndex(
                                                            index,
                                                          );

                                                          setBestOfferImageModalOpen(
                                                            true,
                                                          );
                                                        }}
                                                      >
                                                        Select
                                                      </Button>
                                                    }
                                                    onClick={() => {
                                                      setActiveBestOfferIndex(
                                                        index,
                                                      );

                                                      setBestOfferImageModalOpen(
                                                        true,
                                                      );
                                                    }}
                                                  />
                                                </Form.Item>
                                              </Col>

                                              {/* Furniture and vehicle offer title */}
                                              {showOfferTextFields && (
                                                <Col xs={24} md={12}>
                                                  <Form.Item
                                                    label="Offer Title"
                                                    name={[
                                                      "config",
                                                      "generalConfig",
                                                      "bestOfferImages",
                                                      index,
                                                      "title",
                                                    ]}
                                                    rules={[
                                                      {
                                                        required: true,
                                                        whitespace: true,
                                                        message:
                                                          "Please enter the offer title.",
                                                      },
                                                      {
                                                        max: 150,
                                                        message:
                                                          "Title cannot exceed 150 characters.",
                                                      },
                                                    ]}
                                                  >
                                                    <Input
                                                      maxLength={150}
                                                      showCount
                                                      placeholder="Enter offer title"
                                                    />
                                                  </Form.Item>
                                                </Col>
                                              )}

                                              {/* Furniture and vehicle offer subtitle */}
                                              {showOfferTextFields && (
                                                <Col xs={24} md={12}>
                                                  <Form.Item
                                                    label="Offer Subtitle"
                                                    name={[
                                                      "config",
                                                      "generalConfig",
                                                      "bestOfferImages",
                                                      index,
                                                      "subTitle",
                                                    ]}
                                                    rules={[
                                                      {
                                                        required: true,
                                                        whitespace: true,
                                                        message:
                                                          "Please enter the offer subtitle.",
                                                      },
                                                      {
                                                        max: 250,
                                                        message:
                                                          "Subtitle cannot exceed 250 characters.",
                                                      },
                                                    ]}
                                                  >
                                                    <Input
                                                      maxLength={250}
                                                      showCount
                                                      placeholder="Enter offer subtitle"
                                                    />
                                                  </Form.Item>
                                                </Col>
                                              )}

                                              {/* Banner preview */}
                                              <Col xs={24}>
                                                <Form.Item
                                                  noStyle
                                                  shouldUpdate={(
                                                    previousValues,
                                                    currentValues,
                                                  ) => {
                                                    const previousBanner =
                                                      previousValues?.config
                                                        ?.generalConfig
                                                        ?.bestOfferImages?.[
                                                        index
                                                      ]?.banner;

                                                    const currentBanner =
                                                      currentValues?.config
                                                        ?.generalConfig
                                                        ?.bestOfferImages?.[
                                                        index
                                                      ]?.banner;

                                                    return (
                                                      previousBanner !==
                                                      currentBanner
                                                    );
                                                  }}
                                                >
                                                  {({ getFieldValue }) => {
                                                    const banner =
                                                      getFieldValue([
                                                        "config",
                                                        "generalConfig",
                                                        "bestOfferImages",
                                                        index,
                                                        "banner",
                                                      ]) as
                                                      | string
                                                      | undefined;

                                                    if (!banner) {
                                                      return (
                                                        <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
                                                          <div className="text-center text-gray-500">
                                                            <ImageIcon className="mx-auto mb-2 h-7 w-7" />

                                                            <p className="mb-0">
                                                              No banner selected
                                                            </p>
                                                          </div>
                                                        </div>
                                                      );
                                                    }

                                                    return (
                                                      <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                          src={imageUrlSet(
                                                            banner,
                                                          )}
                                                          alt={`Offer banner ${index + 1
                                                            }`}
                                                          className="h-48 w-full object-cover sm:h-64"
                                                        />
                                                      </div>
                                                    );
                                                  }}
                                                </Form.Item>
                                              </Col>
                                            </Row>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            }}
                          </Form.Item>
                        ),
                      },

                      ...(isRestaurantTemplate
                        ? [
                          {
                            key: "ourChef",
                            label: "Our Chef",
                            forceRender: true,
                            children: (
                              <Form.List
                                name={[
                                  "config",
                                  "generalConfig",
                                  "ourChef",
                                ]}
                              >
                                {(fields, { add, remove }) => (
                                  <div>
                                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                      <div>
                                        <h3 className="mb-1 text-base font-semibold">
                                          Our Chefs
                                        </h3>

                                        <p className="mb-0 text-sm text-gray-500">
                                          Add chef name and image.
                                        </p>
                                      </div>

                                      <Button
                                        type="dashed"
                                        onClick={() =>
                                          add({
                                            name: "",
                                            image: "",
                                          })
                                        }
                                      >
                                        Add Chef
                                      </Button>
                                    </div>

                                    {fields.length === 0 ? (
                                      <Alert
                                        type="info"
                                        showIcon
                                        message="No chef added"
                                        description="Click Add Chef to add your first chef."
                                      />
                                    ) : (
                                      <div className="space-y-4">
                                        {fields.map(
                                          (
                                            {
                                              key,
                                              name,
                                              ...restField
                                            },
                                            index,
                                          ) => (
                                            <div
                                              key={key}
                                              className="rounded-xl border border-gray-200 p-4"
                                            >
                                              <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                                                <div>
                                                  <h4 className="mb-0 font-semibold">
                                                    Chef {index + 1}
                                                  </h4>

                                                  <p className="mb-0 mt-1 text-sm text-gray-500">
                                                    Add chef name and photo.
                                                  </p>
                                                </div>

                                                <Button
                                                  danger
                                                  type="text"
                                                  onClick={() =>
                                                    remove(name)
                                                  }
                                                >
                                                  Remove
                                                </Button>
                                              </div>

                                              <Row gutter={[16, 8]}>
                                                {/* Chef name */}
                                                <Col xs={24} md={12}>
                                                  <Form.Item
                                                    {...restField}
                                                    label="Chef Name"
                                                    name={[name, "name"]}
                                                    rules={[
                                                      {
                                                        required: true,
                                                        whitespace: true,
                                                        message:
                                                          "Please enter the chef name.",
                                                      },
                                                      {
                                                        max: 120,
                                                        message:
                                                          "Chef name cannot exceed 120 characters.",
                                                      },
                                                    ]}
                                                  >
                                                    <Input
                                                      maxLength={120}
                                                      showCount
                                                      placeholder="Khairul"
                                                    />
                                                  </Form.Item>
                                                </Col>

                                                {/* Chef image */}
                                                <Col xs={24} md={12}>
                                                  <Form.Item
                                                    {...restField}
                                                    label="Chef Image"
                                                    name={[name, "image"]}
                                                    rules={[
                                                      {
                                                        required: true,
                                                        message:
                                                          "Please select a chef image.",
                                                      },
                                                    ]}
                                                  >
                                                    <Input
                                                      readOnly
                                                      placeholder="Select chef image"
                                                      onClick={() => {
                                                        setActiveChefIndex(
                                                          name,
                                                        );

                                                        setChefImageModalOpen(
                                                          true,
                                                        );
                                                      }}
                                                      addonAfter={
                                                        <Button
                                                          type="text"
                                                          size="small"
                                                          icon={
                                                            <ImageIcon className="h-4 w-4" />
                                                          }
                                                          onClick={(
                                                            event,
                                                          ) => {
                                                            event.stopPropagation();

                                                            setActiveChefIndex(
                                                              name,
                                                            );

                                                            setChefImageModalOpen(
                                                              true,
                                                            );
                                                          }}
                                                        >
                                                          Select
                                                        </Button>
                                                      }
                                                    />
                                                  </Form.Item>
                                                </Col>

                                                {/* Chef image preview */}
                                                <Col xs={24}>
                                                  <Form.Item
                                                    noStyle
                                                    shouldUpdate={(
                                                      previousValues,
                                                      currentValues,
                                                    ) => {
                                                      const previousImage =
                                                        previousValues
                                                          ?.config
                                                          ?.generalConfig
                                                          ?.ourChef?.[
                                                          name
                                                        ]?.image;

                                                      const currentImage =
                                                        currentValues
                                                          ?.config
                                                          ?.generalConfig
                                                          ?.ourChef?.[
                                                          name
                                                        ]?.image;

                                                      return (
                                                        previousImage !==
                                                        currentImage
                                                      );
                                                    }}
                                                  >
                                                    {({
                                                      getFieldValue,
                                                    }) => {
                                                      const chefImage =
                                                        getFieldValue([
                                                          "config",
                                                          "generalConfig",
                                                          "ourChef",
                                                          name,
                                                          "image",
                                                        ]) as
                                                        | string
                                                        | undefined;

                                                      if (!chefImage) {
                                                        return (
                                                          <div className="flex min-h-44 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
                                                            <div className="text-center text-gray-500">
                                                              <ImageIcon className="mx-auto mb-2 h-8 w-8" />

                                                              <p className="mb-0 text-sm">
                                                                No chef image
                                                                selected
                                                              </p>
                                                            </div>
                                                          </div>
                                                        );
                                                      }

                                                      return (
                                                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                                          <img
                                                            src={imageUrlSet(
                                                              chefImage,
                                                            )}
                                                            alt={`Chef ${index + 1}`}
                                                            className="h-64 w-full object-cover object-top"
                                                          />
                                                        </div>
                                                      );
                                                    }}
                                                  </Form.Item>
                                                </Col>
                                              </Row>
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Form.List>
                            ),
                          },
                        ]
                        : []),

                      ...(isRestaurantTemplate
                        ? [
                          {
                            key: "restaurantSection",
                            label: "Restaurant Section",
                            forceRender: true,
                            children: (
                              <div>
                                <div className="mb-5">
                                  <h3 className="mb-1 text-base font-semibold">
                                    Restaurant Information
                                  </h3>

                                  <p className="mb-0 text-sm text-gray-500">
                                    Add the restaurant section name,
                                    description and image.
                                  </p>
                                </div>

                                <Row gutter={[16, 8]}>
                                  {/* Name */}
                                  <Col xs={24} md={12}>
                                    <Form.Item
                                      label="Name"
                                      name={[
                                        "config",
                                        "generalConfig",
                                        "restaurantSection",
                                        "name",
                                      ]}
                                      rules={[
                                        {
                                          required: true,
                                          whitespace: true,
                                          message:
                                            "Please enter the restaurant section name.",
                                        },
                                        {
                                          max: 150,
                                          message:
                                            "Name cannot exceed 150 characters.",
                                        },
                                      ]}
                                    >
                                      <Input
                                        maxLength={150}
                                        showCount
                                        placeholder="Our Food Categories"
                                      />
                                    </Form.Item>
                                  </Col>

                                  {/* Image */}
                                  <Col xs={24} md={12}>
                                    <Form.Item
                                      label="Image"
                                      name={[
                                        "config",
                                        "generalConfig",
                                        "restaurantSection",
                                        "image",
                                      ]}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Please select an image.",
                                        },
                                      ]}
                                    >
                                      <Input
                                        readOnly
                                        placeholder="Select restaurant image"
                                        onClick={() =>
                                          setRestaurantImageModalOpen(
                                            true,
                                          )
                                        }
                                        addonAfter={
                                          <Button
                                            type="text"
                                            size="small"
                                            icon={
                                              <ImageIcon className="h-4 w-4" />
                                            }
                                            onClick={(event) => {
                                              event.stopPropagation();

                                              setRestaurantImageModalOpen(
                                                true,
                                              );
                                            }}
                                          >
                                            Select
                                          </Button>
                                        }
                                      />
                                    </Form.Item>
                                  </Col>

                                  {/* Description */}
                                  <Col xs={24}>
                                    <Form.Item
                                      label="Description"
                                      name={[
                                        "config",
                                        "generalConfig",
                                        "restaurantSection",
                                        "description",
                                      ]}
                                      rules={[
                                        {
                                          required: true,
                                          whitespace: true,
                                          message:
                                            "Please enter the restaurant description.",
                                        },
                                        {
                                          max: 500,
                                          message:
                                            "Description cannot exceed 500 characters.",
                                        },
                                      ]}
                                    >
                                      <Input.TextArea
                                        rows={4}
                                        maxLength={500}
                                        showCount
                                        placeholder="Discover delicious fast food, street food, traditional meals and freshly prepared dishes."
                                      />
                                    </Form.Item>
                                  </Col>

                                  {/* Image preview */}
                                  <Col xs={24}>
                                    <Form.Item
                                      noStyle
                                      shouldUpdate={(
                                        previousValues,
                                        currentValues,
                                      ) => {
                                        const previousImage =
                                          previousValues?.config
                                            ?.generalConfig
                                            ?.restaurantSection
                                            ?.image;

                                        const currentImage =
                                          currentValues?.config
                                            ?.generalConfig
                                            ?.restaurantSection
                                            ?.image;

                                        return (
                                          previousImage !==
                                          currentImage
                                        );
                                      }}
                                    >
                                      {({ getFieldValue }) => {
                                        const image =
                                          getFieldValue([
                                            "config",
                                            "generalConfig",
                                            "restaurantSection",
                                            "image",
                                          ]) as
                                          | string
                                          | undefined;

                                        if (!image) {
                                          return (
                                            <div className="flex min-h-44 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
                                              <div className="text-center text-gray-500">
                                                <ImageIcon className="mx-auto mb-2 h-8 w-8" />

                                                <p className="mb-0 text-sm">
                                                  No restaurant image
                                                  selected
                                                </p>
                                              </div>
                                            </div>
                                          );
                                        }

                                        return (
                                          <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                              src={imageUrlSet(image)}
                                              alt="Restaurant section"
                                              className="h-52 w-full object-cover sm:h-72"
                                            />
                                          </div>
                                        );
                                      }}
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </div>
                            ),
                          },
                        ]
                        : []),

                      {
                        key: "extraPage",
                        label: "Extra Page",
                        forceRender: true,
                        children: (
                          <Row gutter={[16, 16]}>
                            <Col xs={24}>
                              <div className="mb-3">
                                <strong>Extra Page Content</strong>
                                <p className="mb-0 text-sm text-gray-500">
                                  Add the content for your About Us and Terms & Conditions pages.
                                </p>
                              </div>
                            </Col>

                            <Col xs={24}>
                              <Form.Item
                                label="Privacy Policy"
                                name={["config", "generalConfig", "extraPage", "about"]}
                              >
                                <Input.TextArea
                                  rows={8}
                                  placeholder="Write about your business..."
                                  showCount
                                  maxLength={5000}
                                />
                              </Form.Item>
                            </Col>

                            <Col xs={24}>
                              <Form.Item
                                label="Terms & Conditions"
                                name={[
                                  "config",
                                  "generalConfig",
                                  "extraPage",
                                  "termsAndConditions",
                                ]}
                              >
                                <Input.TextArea
                                  rows={10}
                                  placeholder="Write your terms and conditions..."
                                  showCount
                                  maxLength={10000}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        ),
                      },

                      {
                        key: "faq",
                        label: "FAQ",
                        forceRender: true,
                        children: (
                          <Row gutter={[16, 16]}>
                            <Col xs={24}>
                              <div className="mb-3">
                                <strong>Frequently Asked Questions</strong>

                                <p className="mb-0 text-sm text-gray-500">
                                  Add questions and answers for the FAQ page.
                                </p>
                              </div>
                            </Col>

                            <Col xs={24}>
                              <Form.List name={["config", "generalConfig", "faqs"]}>
                                {(fields, { add, remove }) => (
                                  <div className="space-y-4">
                                    {fields.map(({ key, name, ...restField }, index) => (
                                      <Row
                                        key={key}
                                        gutter={[16, 8]}
                                        align="top"
                                        className="rounded-lg border border-gray-200 p-4"
                                      >
                                        <Col xs={24} lg={10}>
                                          <Form.Item
                                            {...restField}
                                            label={`Question ${index + 1}`}
                                            name={[name, "question"]}
                                            rules={[
                                              {
                                                required: true,
                                                message: "Please enter the question",
                                              },
                                            ]}
                                          >
                                            <Input.TextArea
                                              rows={3}
                                              placeholder="Enter FAQ question"
                                            />
                                          </Form.Item>
                                        </Col>

                                        <Col xs={24} lg={12}>
                                          <Form.Item
                                            {...restField}
                                            label="Answer"
                                            name={[name, "answer"]}
                                            rules={[
                                              {
                                                required: true,
                                                message: "Please enter the answer",
                                              },
                                            ]}
                                          >
                                            <Input.TextArea
                                              rows={3}
                                              placeholder="Enter FAQ answer"
                                            />
                                          </Form.Item>
                                        </Col>

                                        <Col xs={24} lg={2}>
                                          <Form.Item label=" ">
                                            <Button
                                              danger
                                              icon={<Minus />}
                                              onClick={() => remove(name)}
                                            />
                                          </Form.Item>
                                        </Col>
                                      </Row>
                                    ))}

                                    <Button
                                      type="dashed"
                                      block
                                      icon={<Plus />}
                                      onClick={() =>
                                        add({
                                          question: "",
                                          answer: "",
                                        })
                                      }
                                    >
                                      Add FAQ
                                    </Button>
                                  </div>
                                )}
                              </Form.List>
                            </Col>
                          </Row>
                        ),
                      },

                      {
                        key: "partners",
                        label: "Partner Logos",
                        forceRender: true,
                        children: (
                          <Form.List
                            name={["config", "generalConfig", "partners"]}
                          >
                            {(fields, { add, remove }) => (
                              <>
                                <div className="mb-3 flex items-center justify-between">
                                  <div>
                                    <strong>Partner Logos</strong>
                                    <p className="mb-0 text-sm text-gray-500">
                                      Add partner logo URLs from media modal.
                                    </p>
                                  </div>

                                  <Button type="dashed" onClick={() => add("")}>
                                    Add Partner
                                  </Button>
                                </div>

                                {fields.map(
                                  ({ key, name, ...restField }, index) => (
                                    <Row gutter={16} key={key}>
                                      <Col xs={24} md={20}>
                                        <Form.Item
                                          {...restField}
                                          label={`Partner Logo ${index + 1}`}
                                          name={name}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Please select partner logo",
                                            },
                                          ]}
                                        >
                                          <Input
                                            readOnly
                                            placeholder="Select partner logo"
                                            onClick={() => {
                                              setActivePartnerIndex(name);
                                              setPartnerImageModalOpen(true);
                                            }}
                                          />
                                        </Form.Item>
                                      </Col>

                                      <Col xs={24} md={4}>
                                        <Form.Item label="Action">
                                          <Button
                                            danger
                                            onClick={() => remove(name)}
                                          >
                                            Remove
                                          </Button>
                                        </Form.Item>
                                      </Col>
                                    </Row>
                                  ),
                                )}
                              </>
                            )}
                          </Form.List>
                        ),
                      },
                    ]}
                  />
                </>
              ),
            },

            {
              key: "theme",
              label: "Theme",
              forceRender: true,
              children: (
                <Row gutter={[16, 16]}>
                  {/* Primary color */}
                  <Col xs={24} md={8}>
                    <Form.Item label="Primary Color">
                      <div className="mb-2 flex justify-end">
                        <Segmented
                          size="small"
                          value={primaryMode}
                          options={[
                            {
                              label: "Color",
                              value: "picker",
                            },
                            {
                              label: "Text",
                              value: "text",
                            },
                          ]}
                          onChange={(value) =>
                            setPrimaryMode(
                              value as ColorInputMode,
                            )
                          }
                        />
                      </div>

                      <Form.Item
                        name={[
                          "theme",
                          "primaryColor",
                        ]}
                        noStyle
                      >
                        <Input
                          type={
                            primaryMode === "picker"
                              ? "color"
                              : "text"
                          }
                          placeholder={
                            primaryMode === "text"
                              ? "#2563eb, rgb(37, 99, 235) or var(--primary)"
                              : undefined
                          }
                          className={
                            primaryMode === "picker"
                              ? "h-10 cursor-pointer"
                              : ""
                          }
                        />
                      </Form.Item>
                    </Form.Item>
                  </Col>

                  {/* Secondary color */}
                  <Col xs={24} md={8}>
                    <Form.Item label="Secondary Color">
                      <div className="mb-2 flex justify-end">
                        <Segmented
                          size="small"
                          value={secondaryMode}
                          options={[
                            {
                              label: "Color",
                              value: "picker",
                            },
                            {
                              label: "Text",
                              value: "text",
                            },
                          ]}
                          onChange={(value) =>
                            setSecondaryMode(
                              value as ColorInputMode,
                            )
                          }
                        />
                      </div>

                      <Form.Item
                        name={[
                          "theme",
                          "secondaryColor",
                        ]}
                        noStyle
                      >
                        <Input
                          type={
                            secondaryMode === "picker"
                              ? "color"
                              : "text"
                          }
                          placeholder={
                            secondaryMode === "text"
                              ? "#f8f5f1, rgb(...) or var(--secondary)"
                              : undefined
                          }
                          className={
                            secondaryMode === "picker"
                              ? "h-10 cursor-pointer"
                              : ""
                          }
                        />
                      </Form.Item>
                    </Form.Item>
                  </Col>

                  {/* Accent color */}
                  <Col xs={24} md={8}>
                    <Form.Item label="Accent Color">
                      <div className="mb-2 flex justify-end">
                        <Segmented
                          size="small"
                          value={accentMode}
                          options={[
                            {
                              label: "Color",
                              value: "picker",
                            },
                            {
                              label: "Text",
                              value: "text",
                            },
                          ]}
                          onChange={(value) =>
                            setAccentMode(
                              value as ColorInputMode,
                            )
                          }
                        />
                      </div>

                      <Form.Item
                        name={[
                          "theme",
                          "accentColor",
                        ]}
                        noStyle
                      >
                        <Input
                          type={
                            accentMode === "picker"
                              ? "color"
                              : "text"
                          }
                          placeholder={
                            accentMode === "text"
                              ? "#7c3aed, rgb(...) or var(--accent)"
                              : undefined
                          }
                          className={
                            accentMode === "picker"
                              ? "h-10 cursor-pointer"
                              : ""
                          }
                        />
                      </Form.Item>
                    </Form.Item>
                  </Col>

                  {/* Font */}
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Font Family"
                      name={["theme", "fontFamily"]}
                      rules={[
                        {
                          required: true,
                          message:
                            "Please enter font family",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        placeholder="Select a Google font"
                        optionFilterProp="label"
                        options={templateFontOptions}
                        allowClear
                      />
                    </Form.Item>
                  </Col>

                  {/* Logo */}
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Logo"
                      name={["theme", "logoUrl"]}
                    >
                      <Input
                        readOnly
                        placeholder="Select logo"
                        onClick={() =>
                          setThemeLogoModalOpen(true)
                        }
                      />
                    </Form.Item>
                  </Col>

                  {/* Favicon */}
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Favicon"
                      name={["theme", "faviconUrl"]}
                    >
                      <Input
                        readOnly
                        placeholder="Select favicon"
                        onClick={() =>
                          setThemeFaviconModalOpen(true)
                        }
                      />
                    </Form.Item>
                  </Col>

                  {/* Custom CSS */}
                  <Col xs={24}>
                    <Form.Item
                      label="Custom CSS"
                      name={["theme", "customCss"]}
                    >
                      <TextArea
                        rows={8}
                        placeholder=".hero { min-height: 70vh; }"
                      />
                    </Form.Item>
                  </Col>

                  {/* Live theme preview */}
                  <Col xs={24}>
                    <Form.Item
                      noStyle
                      shouldUpdate={(
                        previousValues,
                        currentValues,
                      ) => {
                        const previousTheme =
                          previousValues?.theme;

                        const currentTheme =
                          currentValues?.theme;

                        return (
                          previousTheme?.primaryColor !==
                          currentTheme?.primaryColor ||
                          previousTheme?.secondaryColor !==
                          currentTheme?.secondaryColor ||
                          previousTheme?.accentColor !==
                          currentTheme?.accentColor ||
                          previousTheme?.fontFamily !==
                          currentTheme?.fontFamily ||
                          previousTheme?.logoUrl !==
                          currentTheme?.logoUrl ||
                          previousTheme?.faviconUrl !==
                          currentTheme?.faviconUrl
                        );
                      }}
                    >
                      {({ getFieldValue }) => {
                        const theme =
                          getFieldValue("theme") ?? {};

                        const primaryColor = theme.primaryColor || "#fef8ee";

                        const secondaryColor = theme.secondaryColor || "#f6f6f6";

                        const accentColor = theme.accentColor || "#ffffff";

                        const navbarColor = topbarColor || "#ffffff";

                        const navbarText = topbarText || "#000000";

                        const cardBackGround = cardColor || "#ffffff"


                        const fontFamily = theme.fontFamily || "Arial, sans-serif";

                        const logoUrl = theme.logoUrl as
                          | string
                          | undefined;

                        const faviconUrl =
                          theme.faviconUrl as
                          | string
                          | undefined;

                        const colorItems = [
                          {
                            label: "Primary",
                            value: primaryColor,
                          },
                          {
                            label: "Secondary",
                            value: secondaryColor,
                          },
                          {
                            label: "Accent",
                            value: accentColor,
                          },
                        ];

                        return (
                          <div className="mt-2"
                            style={{
                              background: accentColor
                            }}
                          >
                            <div className="mb-3">
                              <h3 className="mb-1 text-base font-semibold">
                                Live Theme Preview
                              </h3>

                              <p className="mb-0 text-sm text-gray-500">
                                This preview updates when
                                you change the theme
                                settings.
                              </p>
                            </div>

                            <div
                              className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm"
                              style={{
                                fontFamily,
                              }}
                            >
                              {/* Preview navbar */}
                              <header
                              style={{
                                backgroundColor: navbarColor,
                                color: navbarText,
                              }}
                                className="flex min-h-16 items-center justify-between gap-3 border-b border-black/10 px-4 py-3 sm:px-6"
                              >
                                <div className="flex min-w-0 items-center gap-3">
                                  {logoUrl ? (
                                    <div className="flex h-10 max-w-36 items-center rounded-lg bg-white px-2">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={imageUrlSet(
                                          logoUrl,
                                        )}
                                        alt="Theme logo"
                                        className="max-h-8 max-w-full object-contain"
                                      />
                                    </div>
                                  ) : (
                                    <div
                                      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-lg font-bold bg-white"
                                    >
                                      S
                                    </div>
                                  )}

                                  <div className="min-w-0">
                                    <p className="mb-0 truncate text-base font-bold">
                                      Your Store
                                    </p>

                                    <p className="mb-0 hidden text-xs opacity-80 sm:block">
                                      Dynamic storefront
                                      theme
                                    </p>
                                  </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                  {faviconUrl && (
                                    <div className="grid h-9 w-9 place-items-center rounded-full bg-white">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={imageUrlSet(
                                          faviconUrl,
                                        )}
                                        alt="Theme favicon"
                                        className="h-5 w-5 object-contain"
                                      />
                                    </div>
                                  )}

                                  <button
                                    type="button"
                                    className="rounded-lg px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm"
                                    style={{
                                      backgroundColor: "#5e57c7",
                                      color: "#ffffff",
                                    }}
                                  >
                                    Shop Now
                                  </button>
                                </div>
                              </header>

                              {/* Preview hero */}
                              <section
                                style={{
                                  background: primaryColor,
                                }}
                                className="grid gap-6 px-4 py-8 sm:px-6 md:grid-cols-2 md:items-center md:px-10 md:py-12">
                                <div>
                                  <span
                                    className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                                  >
                                    New Collection
                                  </span>

                                  <h2 className="mt-4 text-2xl font-bold leading-tight text-gray-950 sm:text-3xl">
                                    Discover products made
                                    for your lifestyle
                                  </h2>

                                  <p className="mt-3 max-w-lg text-sm leading-6 text-gray-600">
                                    This area previews your
                                    selected primary,
                                    secondary, accent and
                                    font settings.
                                  </p>

                                  <div className="mt-5 flex flex-wrap gap-3">
                                    <button
                                      type="button"
                                      className="rounded-lg px-5 py-2.5 text-sm font-semibold"
                                      style={{
                                        backgroundColor: "#5e57c7",
                                        color: "#ffffff",
                                      }}
                                    >
                                      Explore Products
                                    </button>

                                  </div>
                                </div>

                                <div
                                  className="flex min-h-52 items-center justify-center rounded-2xl p-6"
                                // style={{
                                //   backgroundColor:
                                //     primaryColor,
                                // }}
                                >
                                  <div
                                    className="grid h-32 w-32 place-items-center rounded-full text-center text-lg font-bold text-white shadow-lg sm:h-40 sm:w-40"
                                  >
                                    Product
                                    <br />
                                    Preview
                                  </div>
                                </div>
                              </section>

                              {/* Product cards */}
                              <section
                              style={{
                                background: secondaryColor,
                              }}
                              className="px-4 py-6 sm:px-6 md:px-10">
                                <div className="mb-4 flex items-center justify-between gap-3">
                                  <div>
                                    <h3 className="mb-1 text-lg font-bold text-gray-950">
                                      Featured Products
                                    </h3>

                                    <p className="mb-0 text-xs text-gray-500">
                                      Sample product card
                                      preview
                                    </p>
                                  </div>

                                  <span
                                    className="rounded-full px-3 py-1 text-xs font-semibold"
                                  >
                                    Featured
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                  {[
                                    "Classic Product",
                                    "Premium Product",
                                    "Popular Product",
                                  ].map(
                                    (product, index) => (
                                      <article
                                      style={{
                                        background: cardBackGround
                                      }}
                                        key={product}
                                        className="overflow-hidden rounded-xl border border-black/10 shadow-sm"
                                      >
                                        <div
                                          className="flex h-32 items-center justify-center"
                                          style={{
                                            backgroundColor:
                                              secondaryColor,
                                          }}
                                        >
                                          <div
                                            className="h-16 w-16 rounded-full"
                                          />
                                        </div>

                                        <div className="p-4">
                                          <h4 className="mb-1 font-semibold text-gray-950">
                                            {product}
                                          </h4>

                                          <p className="mb-3 text-xs text-gray-500">
                                            Product category
                                          </p>

                                          <div className="flex items-center justify-between gap-3">
                                            <strong
                                            // style={{
                                            //   color:
                                            //     primaryColor,
                                            // }}
                                            >
                                              $
                                              {29 +
                                                index * 10}
                                              .00
                                            </strong>

                                            <button
                                              type="button"
                                              className="rounded-md px-3 py-1.5 text-xs font-semibold"

                                            >
                                              Add
                                            </button>
                                          </div>
                                        </div>
                                      </article>
                                    ),
                                  )}
                                </div>
                              </section>
                            </div>

                            {/* Color values */}
                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                              {colorItems.map(
                                (item) => (
                                  <div
                                    key={item.label}
                                    className="rounded-xl border border-gray-200 bg-white p-3"
                                  >
                                    <div
                                      className="mb-3 h-12 rounded-lg border border-black/10"
                                      style={{
                                        backgroundColor:
                                          item.value,
                                      }}
                                    />

                                    <p className="mb-1 text-sm font-semibold text-gray-800">
                                      {item.label} Color
                                    </p>

                                    <p className="mb-0 truncate text-xs text-gray-500">
                                      {item.value}
                                    </p>
                                  </div>
                                ),
                              )}
                            </div>

                            <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4">
                              <p className="mb-1 text-sm font-semibold text-gray-800">
                                Font Family
                              </p>

                              <p
                                className="mb-0 text-lg"
                                style={{ fontFamily }}
                              >
                                {fontFamily}
                              </p>
                            </div>
                          </div>
                        );
                      }}
                    </Form.Item>
                  </Col>
                </Row>
              ),
            },

            {
              key: "seo",
              label: "SEO",
              children: (
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Meta Title"
                      name={["seo", "metaTitle"]}
                    // rules={[{ required: true }]}
                    >
                      <Input placeholder="Acme Store" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Meta Keywords"
                    // name={["seo", "metaKeywords"]}
                    >
                      <Input placeholder="acme,shop,ecommerce" />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item
                      label="Meta Description"
                      name={["seo", "metaDescription"]}
                      rules={[{ required: true }]}
                    >
                      <TextArea rows={3} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="OG Title" name={["seo", "ogTitle"]}>
                      <Input placeholder="Acme Store" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="OG Image URL"
                      name={["seo", "ogImageUrl"]}
                    >
                      <Input placeholder="/uploads/media/og.png" />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item
                      label="OG Description"
                      name={["seo", "ogDescription"]}
                    >
                      <TextArea rows={3} />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item
                      label="Canonical URL"
                      name={["seo", "canonicalUrl"]}
                    >
                      <Input placeholder="https://shop.example.com" />
                    </Form.Item>
                  </Col>
                </Row>
              ),
            },
          ]}
        />

        <Form.Item style={{ marginBottom: 0 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              {mode === "create" ? "Create website" : "Update website"}
            </Button>

            <Button onClick={() => form.resetFields()}>Reset</Button>
          </Space>
        </Form.Item>
      </Form>

      <ImageSelectModal
        open={slideImageModalOpen}
        selectedUrl={selectedSlideImage ?? ""}
        onClose={() => {
          setSlideImageModalOpen(false);
          setActiveSlideIndex(null);
        }}
        onSelect={(url) => {
          if (activeSlideIndex === null) return;

          form.setFieldValue(
            ["config", "headerConfig", "slide", activeSlideIndex, "imageUrl"],
            url,
          );

          setSlideImageModalOpen(false);
          setActiveSlideIndex(null);
        }}
      />

      <ImageSelectModal
        open={bestOfferImageModalOpen}
        selectedUrl={selectedBestOfferImage ?? ""}
        onClose={() => {
          setBestOfferImageModalOpen(false);
          setActiveBestOfferIndex(null);
        }}
        onSelect={(url) => {
          if (activeBestOfferIndex === null) return;

          form.setFieldValue(
            [
              "config",
              "generalConfig",
              "bestOfferImages",
              activeBestOfferIndex,
              "banner",
            ],
            url,
          );

          setBestOfferImageModalOpen(false);
          setActiveBestOfferIndex(null);
        }}
      />

      <ImageSelectModal
        open={partnerImageModalOpen}
        selectedUrl={selectedPartnerImage ?? ""}
        onClose={() => {
          setPartnerImageModalOpen(false);
          setActivePartnerIndex(null);
        }}
        onSelect={(url) => {
          if (activePartnerIndex === null) return;

          form.setFieldValue(
            ["config", "generalConfig", "partners", activePartnerIndex],
            url,
          );

          setPartnerImageModalOpen(false);
          setActivePartnerIndex(null);
        }}
      />

      <ImageSelectModal
        open={themeLogoModalOpen}
        selectedUrl={themeLogoUrl ?? ""}
        onClose={() => {
          setThemeLogoModalOpen(false);
        }}
        onSelect={(url) => {
          form.setFieldValue(["theme", "logoUrl"], url);
          setThemeLogoModalOpen(false);
        }}
      />

      <ImageSelectModal
        open={themeFaviconModalOpen}
        selectedUrl={themeFaviconUrl ?? ""}
        onClose={() => {
          setThemeFaviconModalOpen(false);
        }}
        onSelect={(url) => {
          form.setFieldValue(["theme", "faviconUrl"], url);
          setThemeFaviconModalOpen(false);
        }}
      />

      <ImageSelectModal
        open={restaurantImageModalOpen}
        selectedUrl={selectRestaurantImage ?? ""}
        onClose={() => {
          setRestaurantImageModalOpen(false);
        }}
        onSelect={(url) => {
          form.setFieldValue([
            "config",
            "generalConfig",
            "restaurantSection",
            "image"
          ], url);
          setRestaurantImageModalOpen(false);
        }}
      />

      <ImageSelectModal
        open={chefImageModalOpen}
        selectedUrl={selectedOurChef ?? ""}
        onClose={() => {
          setChefImageModalOpen(false);
          setActiveChefIndex(null);
        }}
        onSelect={(url) => {
          if (activeChefIndex === null) return;

          form.setFieldValue(
            ["config",
              "generalConfig",
              "ourChef",
              activeChefIndex,
              "image"
            ],
            url,
          );

          setChefImageModalOpen(false);
          setActiveChefIndex(null);
        }}
      />

    </Card>
  );
}
