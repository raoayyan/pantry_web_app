import React from "react";

function Team() {
  return (
    <section className="py-10 bg-gradient-to-r from-fuchsia-600 to-blue-600 sm:py-16 lg:py-24">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-2xl mx-auto text-left sm:text-center">
          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl lg:leading-tight">
            Meet the team
          </h2>
          <p className="mt-4 text-xl text-white">
            Our team is a fusion of creativity and logic, dedicated to
            transforming complex problems into elegant solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-8 sm:mt-12 xl:mt-20 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:gap-14">
          <div className="bg-white">
            <div className="py-8 px-9">
              <p className="text-lg font-bold text-black">Ayyan Akbar</p>
              <p className="mt-1 text-gray-600 text-500">Software Engineer</p>
              <p className="mt-6 text-base text-gray-700">
                Proficient Full-Stack Developer with over two years of
                experience crafting robust and scalable applications. Passionate
                about leveraging Artificial Intelligence and Machine Learning to
                drive innovation and create groundbreaking solutions.
              </p>
            </div>
          </div>

          <div className="bg-white">
            <div className="py-8 px-9">
              <p className="text-lg font-bold text-black">MOHAMMED IQRAMUL</p>
              <p className="mt-1 text-gray-600 text-500">
                Full stack developer
              </p>
              <p className="mt-6 text-base text-gray-700">
                Results-oriented Full-Stack Engineer possessing 1+ years of
                expertise in building end-to-end software solutions.
              </p>
            </div>
          </div>

          <div className="bg-white">
            <div className="py-8 px-9">
              <p className="text-lg font-bold text-black">Hamza Anwar</p>
              <p className="mt-1 text-gray-600 text-500">CMO</p>
              <p className="mt-6 text-base text-gray-700">
                Dedicated Security Engineer with a strong foundation in
                safeguarding digital assets. Possessing 2+ years of experience
                in implementing robust security measures, I am committed to
                protecting sensitive information and mitigating cyber threats.
              </p>
            </div>
          </div>

          <div className="bg-white">
            <div className="py-8 px-9">
              <p className="text-lg font-bold text-black">Hammad Afzal</p>
              <p className="mt-1 text-gray-600 text-500">
                Senior Software Engineer
              </p>
              <p className="mt-6 text-base text-gray-700">
                Dynamic Full-Stack Developer with a proven track record of
                delivering high-quality software. Continuously expanding
                knowledge in Artificial Intelligence and Machine Learning to
                build intelligent systems that transform industries
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Team;
