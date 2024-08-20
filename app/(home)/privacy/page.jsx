import React from "react";
import { homeDivider } from "../../../svgs";
import { GFS_Didot } from "next/font/google";
import { Montserrat_Alternates } from "next/font/google";

const gfsFont = GFS_Didot({ weight: "400", subsets: ["greek"] });
const montserratFont = Montserrat_Alternates({
  weight: ["700", "500"],
  subsets: ["latin"],
});

const page = () => {
  return (
    <div className="text-[70%] md:text-[100%]">
      <div className="bg-[#F5F5F5] py-10">
        <div className="lg:mx-14 mx-[5%]">
          <div className="text-center lg:w-[60%] mx-auto">
            <h1 className="text-[3em] text-[500] text-pinkBgDark">
              Privacy Policy
            </h1>
            <p className="text-[#474747]">
              At FoodieFinder, We are Suscipit ducimus dolores expedita id.
              Architecto nobis quia laboriosam ea eum eum ut ratione. Sequi
              reprehenderit aut quam sunt. Magnam ratione eius ducimus et odio.
            </p>
            <div className="flex justify-center items-center my-10">
              <div className="w-[100%] h-[1px] bg-gradient-hr-alt" />
              {homeDivider}
              <div className="w-[100%] h-[1px] bg-gradient-hr" />
            </div>
          </div>
          <div className="relative">
            <img src="/privacy.png" className="absolute top-0 right-0" />
            <div className="flex flex-col gap-14 mb-24 lg:w-[60%]">
              <div>
                <h2
                  className={`text-[1.875em] ${gfsFont.className} text-[400] text-pinkBgDark`}
                >
                  Heading
                </h2>
                <p className={`${montserratFont.className} leading-7`}>
                  Ut sed ea vitae dolore ut. Est ullam et excepturi eum. Quas a
                  qui modi aut qui. Distinctio autem amet ipsum illum qui dolore
                  repellendus tempora. Repellat velit doloribus et aspernatur
                  perferendis voluptatibus commodi adipisci ut. Ut sed ea vitae
                  dolore ut. Est ullam et excepturi eum. Quas a qui modi aut
                  qui. Distinctio autem amet ipsum <br />
                  <br />
                  <br /> illum qui dolore repellendus tempora. Repellat velit
                  doloribus et aspernatur perferendis voluptatibus commodi
                  adipisci ut.Ut sed ea vitae dolore ut. Est ullam et excepturi
                  eum. Quas a qui modi aut qui. Distinctio autem amet ipsum
                  illum qui dolore repellendus tempora. Repellat velit doloribus
                  et aspernatur perferendis voluptatibus commodi adipisci ut. Ut
                  sed ea vitae dolore ut. Est ullam et excepturi eum. Quas a qui
                  modi aut qui. Distinctio <br /> <br />
                  <br /> autem amet ipsum illum qui dolore repellendus tempora.
                  Repellat velit doloribus et aspernatur perferendis
                  voluptatibus commodi adipisci ut.Ut sed ea vitae dolore ut.
                  Est ullam et excepturi eum. Quas a qui modi aut qui.
                  Distinctio autem amet ipsum illum qui dolore repellendus
                  tempora. Repellat velit doloribus et aspernatur perferendis
                  voluptatibus commodi adipisci ut. Ut sed ea vitae dolore ut.
                  Est ullam et excepturi eum. Quas a qui modi aut qui.
                  Distinctio autem amet ipsum illum qui dolore repellendus
                  tempora. Repellat velit doloribus et aspernatur perferendis
                  voluptatibus commodi adipisci ut.
                </p>
              </div>
              <div>
                <h2
                  className={`text-[1.875em] ${gfsFont.className} text-[400] text-pinkBgDark`}
                >
                  Heading
                </h2>
                <p className={`${montserratFont.className} leading-7`}>
                  Ut sed ea vitae dolore ut. Est ullam et excepturi eum. Quas a
                  qui modi aut qui. Distinctio autem amet ipsum illum qui dolore
                  repellendus tempora. Repellat velit doloribus et aspernatur
                  perferendis voluptatibus commodi adipisci ut.
                </p>
              </div>
              <div>
                <h2
                  className={`text-[1.875em] ${gfsFont.className} text-[400] text-pinkBgDark`}
                >
                  Heading #
                </h2>
                <p className={`${montserratFont.className} leading-7`}>
                  Id in facere nam deleniti vero facere qui. Repudiandae
                  voluptatem esse ut dolores. Numquam quod voluptas ut optio
                  autem rerum. Vitae inventore molestiae eaque deserunt aliquid
                  laborum. Veniam recusandae quo natus alias. Quibusdam eligendi
                  vitae explicabo non sint aliquid.
                </p>
              </div>
              <div>
                <h2
                  className={`text-[1.875em] ${gfsFont.className} text-[400] text-pinkBgDark`}
                >
                  Heading #
                </h2>
                <p className={`${montserratFont.className} leading-7`}>
                  Id in facere nam deleniti vero facere qui. Repudiandae
                  voluptatem esse ut dolores. Numquam quod voluptas ut optio
                  autem rerum. Vitae inventore molestiae eaque deserunt aliquid
                  laborum. Veniam recusandae quo natus alias. Quibusdam eligendi
                  vitae explicabo non sint aliquid.
                </p>
              </div>
              <div>
                <h2
                  className={`text-[1.875em] ${gfsFont.className} text-[400] text-pinkBgDark`}
                >
                  Download FoodieFinder For Free
                </h2>
                <p className={`${montserratFont.className} leading-7`}>
                  Id in facere nam deleniti vero facere qui. Repudiandae
                  voluptatem esse ut dolores. Numquam quod voluptas ut optio
                  autem rerum. Vitae inventore molestiae eaque deserunt aliquid
                  laborum. Veniam recusandae quo natus alias. Quibusdam eligendi
                  vitae explicabo non sint aliquid.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
