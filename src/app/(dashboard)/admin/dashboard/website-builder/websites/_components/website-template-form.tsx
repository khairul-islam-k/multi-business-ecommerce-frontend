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

    console.log('payload', payload);

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
                    defaultActiveKey={["headerConfig"]}
                    items={[
                      {
                        key: "headerConfig",
                        label: "Header Config",
                        forceRender: true,
                        children: (
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
                                  <div className="mb-4 flex items-center justify-between">
                                    <strong>
                                      {isRestaurantTemplate
                                        ? "Header Slide"
                                        : "Header Slides"}
                                    </strong>

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
                                              <Row gutter={16}>
                                                <Form.Item
                                                  {...restField}
                                                  name={[name, "id"]}
                                                  hidden
                                                >
                                                  <Input />
                                                </Form.Item>

                                                <Col xs={24} md={12}>
                                                  <Form.Item
                                                    {...restField}
                                                    label="Slide Title"
                                                    name={[name, "title"]}
                                                    rules={[
                                                      {
                                                        required: true,
                                                        message:
                                                          "Please enter slide title",
                                                      },
                                                    ]}
                                                  >
                                                    <Input
                                                      placeholder={
                                                        isRestaurantTemplate
                                                          ? "Delicious Food Delivered Fresh"
                                                          : "New Fashion Collection"
                                                      }
                                                    />
                                                  </Form.Item>
                                                </Col>

                                                <Col xs={24} md={12}>
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
                                                        message:
                                                          "Please enter slide sub title",
                                                      },
                                                    ]}
                                                  >
                                                    <Input
                                                      placeholder={
                                                        isRestaurantTemplate
                                                          ? "Fresh, Hot and Tasty"
                                                          : "Fresh Styles Arrived"
                                                      }
                                                    />
                                                  </Form.Item>
                                                </Col>

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
                                                        message:
                                                          "Please enter button text",
                                                      },
                                                    ]}
                                                  >
                                                    <Input
                                                      placeholder={
                                                        isRestaurantTemplate
                                                          ? "Order Now"
                                                          : "Shop"
                                                      }
                                                    />
                                                  </Form.Item>
                                                </Col>

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
                                                        message:
                                                          "Please enter slide description",
                                                      },
                                                    ]}
                                                  >
                                                    <TextArea
                                                      rows={4}
                                                      placeholder={
                                                        isRestaurantTemplate
                                                          ? "Enjoy freshly prepared meals made with quality ingredients."
                                                          : "Find clothing that matches your personality, comfort, and confidence in every season."
                                                      }
                                                    />
                                                  </Form.Item>
                                                </Col>

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
                                    <div className="rounded-md border border-dashed border-gray-300 p-6 text-center text-gray-500">
                                      No header slide found.
                                    </div>
                                  )}
                                </>
                              );
                            }}
                          </Form.List>
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
                        label: "Dashboard Colors",
                        forceRender: true,
                        children: (
                          <Row gutter={[16, 16]}>
                            <Col xs={24}>
                              <div className="mb-3">
                                <strong>Dashboard Colors</strong>

                                <p className="mb-0 text-sm text-gray-500">
                                  Customize sidebar background, sidebar text, and card colors.
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
                                placeholder="#0f172a or var(--card-color)"
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
                                placeholder="#0f172a or var(--card-color)"
                              />
                            </Col>

                            <Col xs={24} md={8}>
                              <ThemeColorField
                                label="Navbar Text"
                                name={[
                                  "config",
                                  "generalConfig",
                                  "dashboardColors",
                                  "navbarText",
                                ]}
                                placeholder="#0f172a or var(--card-color)"
                              />
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
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    <Form.Item label="Primary Color">
                      <div className="mb-2 flex justify-end">
                        <Segmented
                          size="small"
                          value={primaryMode}
                          options={[
                            { label: "Color", value: "picker" },
                            { label: "Text", value: "text" },
                          ]}
                          onChange={(value) =>
                            setPrimaryMode(value as ColorInputMode)
                          }
                        />
                      </div>

                      <Form.Item
                        name={["theme", "primaryColor"]}
                        noStyle
                      >
                        <Input
                          type={primaryMode === "picker" ? "color" : "text"}
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

                  <Col xs={24} md={8}>
                    <Form.Item label="Secondary Color">
                      <div className="mb-2 flex justify-end">
                        <Segmented
                          size="small"
                          value={secondaryMode}
                          options={[
                            { label: "Color", value: "picker" },
                            { label: "Text", value: "text" },
                          ]}
                          onChange={(value) =>
                            setSecondaryMode(value as ColorInputMode)
                          }
                        />
                      </div>

                      <Form.Item
                        name={["theme", "secondaryColor"]}
                        noStyle
                      >
                        <Input
                          type={secondaryMode === "picker" ? "color" : "text"}
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

                  <Col xs={24} md={8}>
                    <Form.Item label="Accent Color">
                      <div className="mb-2 flex justify-end">
                        <Segmented
                          size="small"
                          value={accentMode}
                          options={[
                            { label: "Color", value: "picker" },
                            { label: "Text", value: "text" },
                          ]}
                          onChange={(value) =>
                            setAccentMode(value as ColorInputMode)
                          }
                        />
                      </div>

                      <Form.Item
                        name={["theme", "accentColor"]}
                        noStyle
                      >
                        <Input
                          type={accentMode === "picker" ? "color" : "text"}
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

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Font Family"
                      name={["theme", "fontFamily"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter font family",
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

                  <Col xs={24} md={12}>
                    <Form.Item label="Logo" name={["theme", "logoUrl"]}>
                      <Input
                        readOnly
                        placeholder="Select logo"
                        onClick={() => setThemeLogoModalOpen(true)}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Favicon" name={["theme", "faviconUrl"]}>
                      <Input
                        readOnly
                        placeholder="Select favicon"
                        onClick={() => setThemeFaviconModalOpen(true)}
                      />
                    </Form.Item>
                  </Col>

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
              {mode === "create" ? "Create Template" : "Update Template"}
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
