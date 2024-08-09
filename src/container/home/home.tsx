import React from "react";
import Link from "next/link";
function HomePage() {
  return (
    <section className="py-10 bg-white sm:py-16 lg:py-24">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid items-center grid-cols-1 gap-y-12 lg:grid-cols-2 lg:gap-x-24">
          <div>
            <img
              className="w-full max-w-md mx-auto"
              src="https://cdn.rareblocks.xyz/collection/celebration/images/integration/2/services-icons.png"
              alt=""
            />
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
              Grow business with connections.
            </h2>
            <p className="mt-6 text-base text-gray-600">
              Tired of rummaging through a cluttered pantry? Say goodbye to
              expired food and surprise ingredients. Our pantry tracker helps
              you organize, plan, and reduce food waste. Take control of your
              kitchen and enjoy the benefits of a well-stocked pantry.
            </p>

            <Link
              href="/pantry"
              title=""
              className="inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-blue-600 rounded-md mt-9 hover:bg-blue-700 focus:bg-blue-700"
              role="button"
            >
              {" "}
              Track Pantry{" "}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
