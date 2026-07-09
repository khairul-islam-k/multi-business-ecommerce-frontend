import Link from "next/link";


export function ElectronicFooter() {


  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4 md:px-10">
        {/* Brand */}
        <div>
          <div className="mb-3 text-xl font-bold text-gray-900">Voltix</div>

          <p className="max-w-xs text-sm text-gray-500">
            Premium electronics for people who care about details.
          </p>
        </div>

        {/* Shop */}
        <div>
          <div className="mb-3 text-xs uppercase tracking-widest text-gray-500">
            Shop
          </div>

          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <Link href="/products" className="hover:text-blue-600">
                All products
              </Link>
            </li>

            <li>
              <Link href="/products" className="hover:text-blue-600">
                New arrivals
              </Link>
            </li>

            <li>
              <Link href="/products" className="hover:text-blue-600">
                Bestsellers
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <div className="mb-3 text-xs uppercase tracking-widest text-gray-500">
            Company
          </div>

          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <Link href="/about" className="hover:text-blue-600">
                About us
              </Link>
            </li>

            <li>
              <Link href="/contact-us" className="hover:text-blue-600">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <div className="mb-3 text-xs uppercase tracking-widest text-gray-500">
            Newsletter
          </div>

          <form className="flex gap-2">
            <input
              type="email"
              placeholder="you@email.com"
              className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Voltix. All rights reserved.
      </div>
    </footer>
  );
}