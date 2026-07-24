"use client";
import Link from "next/link";
import {
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
  Youtube,
} from "lucide-react";
import { useTemplateProductReviewMutation } from "@/lib/api/hooks/template-product-review";
import { useMessage } from "@/app/store/_components/message/message-hook";
import { getWebErrorMessage } from "@/lib/public-api-hook/web-api";
import { FooterConfig } from "@/types/website/website";

type ContactProps = {
  footer: FooterConfig;
}

const FashionContactPage = ({ footer }: ContactProps) => {

  const contactInfo = [
    {
      id: 1,
      title: "Our Location",
      value: footer.address,
      icon: MapPin,
    },
    {
      id: 2,
      title: "Phone Number",
      value: footer.phone,
      icon: Phone,
    },
    {
      id: 3,
      title: "Email Address",
      value: footer.email,
      icon: Mail,
    },
    {
      id: 4,
      title: "Opening Hours",
      value: "10:00 AM - 8:00 PM",
      icon: Clock,
    },
  ];

  const message = useMessage();

  const { contact } = useTemplateProductReviewMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const values = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      await contact.mutateAsync(values);

      message.success("Contact message submitted successfully");
      form.reset();
    } catch (error) {

      message.error(getWebErrorMessage(error));
    }

  };

  return (
    <main className="">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--store-bg-2)] py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#f16d59]">
            Contact Us
          </p>

          <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
            Get In Touch
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600">
            Have questions about our products, orders, or fashion collections?
            Send us a message and our support team will contact you soon.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className="rounded-3xl border border-gray-200 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#f16d59] hover:shadow-lg"
                >
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#f16d59]/10 text-[#f16d59]">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">{item.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Content */}
            <div className="rounded-3xl bg-gray-950 p-8 text-white sm:p-10">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#f16d59]">
                Need Help?
              </p>

              <h2 className="text-3xl font-bold sm:text-4xl">
                Let’s Talk About Your Fashion Needs
              </h2>

              <p className="mt-5 text-sm leading-7 text-gray-400">
                Whether you need help choosing the right product, tracking an
                order, or learning about our latest collection, we are always
                ready to help.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-[#f16d59]">
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div>
                    <h4 className="font-semibold text-white">Address</h4>
                    <p className="mt-1 text-sm text-gray-400">
                      {footer.address}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-[#f16d59]">
                    <Phone className="h-5 w-5" />
                  </div>

                  <div>
                    <h4 className="font-semibold text-white">Call Us</h4>
                    <p className="mt-1 text-sm text-gray-400">
                      {footer.phone}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-[#f16d59]">
                    <Mail className="h-5 w-5" />
                  </div>

                  <div>
                    <h4 className="font-semibold text-white">Email</h4>
                    <p className="mt-1 text-sm text-gray-400">
                      {footer.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="mt-8 flex items-center gap-3">
                <Link
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-[#f16d59]"
                >
                  <Facebook className="h-5 w-5" />
                </Link>

                <Link
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-[#f16d59]"
                >
                  <Instagram className="h-5 w-5" />
                </Link>

                <Link
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-[#f16d59]"
                >
                  <Twitter className="h-5 w-5" />
                </Link>

                <Link
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-[#f16d59]"
                >
                  <Youtube className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-3xl border border-gray-200 bg-[var(--store-bg-1)] p-8 shadow-sm sm:p-10">
              <h2 className="text-3xl font-bold">
                Send Message
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                Fill out the form below and we will get back to you as soon as
                possible.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      className="h-12 w-full bg-[var(--store-bg-1)] rounded-full border border-gray-200 px-5 text-sm outline-none transition focus:border-[#f16d59]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Phone Number
                    </label>
                    <input
                      type="number"
                      name="phone"
                      placeholder="Enter phone number"
                      className="h-12 w-full bg-[var(--store-bg-1)] rounded-full border border-gray-200 px-5 text-sm outline-none transition focus:border-[#f16d59]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter email address"
                    className="h-12 w-full bg-[var(--store-bg-1)] rounded-full border border-gray-200 px-5 text-sm outline-none transition focus:border-[#f16d59]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Enter subject"
                    className="h-12 w-full bg-[var(--store-bg-1)] rounded-full border border-gray-200 px-5 text-sm outline-none transition focus:border-[#f16d59]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    name="message"
                    placeholder="Write your message..."
                    className="w-full bg-[var(--store-bg-1)] resize-none rounded-3xl border border-gray-200 px-5 py-4 text-sm outline-none transition focus:border-[#f16d59]"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gray-950 px-8 text-sm font-bold text-white transition-all duration-300 hover:bg-[#f16d59]"
                >
                  Send Message
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-[var(--store-bg-3)]">
            <div className="flex min-h-[360px] items-center justify-center p-8 text-center">
              <div>
                <MapPin className="mx-auto mb-4 h-12 w-12 text-[#f16d59]" />

                <h3 className="text-2xl font-bold">
                  Our Store Location
                </h3>

                <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-gray-500">
                  Add your Google Map iframe here. Replace this block with your
                  embedded Google Map.
                </p>

                <Link
                  href="https://maps.google.com"
                  target="_blank"
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#f16d59] px-6 text-sm font-bold text-white transition-all duration-300 hover:bg-gray-950"
                >
                  Open Google Map
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FashionContactPage;