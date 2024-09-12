"use client";
import React, { useEffect } from "react";

import { homeDivider } from "../../../svgs";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../../redux/slices/headerSlice";

const Page = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage("About us"));
  }, [dispatch]);

  return (
    <div className="bg-[#F5F5F5] py-10">
      <div className="mx-14">
        <div className="text-center lg:w-[60%] mx-auto">
          <h1 className="text-[48px] text-[500] text-pinkBgDark">About Us</h1>
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
        <div className="flex flex-col gap-14 mb-24">
          <div>
            <h2 className={`text-[30px] text-[400] text-pinkBgDark`}>
              Our Vision
            </h2>
            <p className={`leading-7`}>
              Quos occaecati adipisci. Pariatur quae occaecati vel inventore.
              Quo labore omnis totam facilis rerum numquam. Autem dolorem
              sapiente eius enim ipsa corrupti. Et ea numquam aut voluptatibus
              omnis eos eveniet. Qui voluptatem veniam officia sint et.
            </p>
          </div>
          <div>
            <h2 className={`text-[30px] text-[400] text-pinkBgDark`}>
              Why You Should Choose FoodieFinder
            </h2>
            <p className={`leading-7`}>
              Ut sed ea vitae dolore ut. Est ullam et excepturi eum. Quas a qui
              modi aut qui. Distinctio autem amet ipsum illum qui dolore
              repellendus tempora. Repellat velit doloribus et aspernatur
              perferendis voluptatibus commodi adipisci ut.
            </p>
          </div>
          <div>
            <h2 className={`text-[30px] text-[400] text-pinkBgDark`}>
              Inclusive By Design
            </h2>
            <p className={`leading-7`}>
              Id in facere nam deleniti vero facere qui. Repudiandae voluptatem
              esse ut dolores. Numquam quod voluptas ut optio autem rerum. Vitae
              inventore molestiae eaque deserunt aliquid laborum. Veniam
              recusandae quo natus alias. Quibusdam eligendi vitae explicabo non
              sint aliquid.
            </p>
          </div>
          <div>
            <h2 className={`text-[30px] text-[400] text-pinkBgDark`}>
              Features That Matter
            </h2>
            <p className={`leading-7`}>
              Consequatur voluptas corrupti quod similique quia. Molestias
              aperiam quae consequatur rem. Quis ea sequi illo. Dolor quam aut
              perferendis sit ducimus totam sed. Ea eum atque incidunt numquam.
              Cumque nihil ut nobis consequatur voluptas.
            </p>
          </div>
          <div>
            <h2 className={`text-[30px] text-[400] text-pinkBgDark`}>
              Heading #
            </h2>
            <p className={`leading-7`}>
              Veritatis iure aut aut dolorum culpa ut quis error eligendi.
              Deleniti aliquam eos pariatur dolor delectus sint. Voluptate saepe
              placeat occaecati molestiae rerum excepturi ut sequi. Ex
              reprehenderit veritatis consequuntur dolorem qui debitis. Dicta
              repellat a rerum odit et maxime excepturi nesciunt recusandae. Eos
              tempore adipisci reiciendis.
            </p>
          </div>
          <div>
            <h2 className={`text-[30px] text-[400] text-pinkBgDark`}>
              Heading #
            </h2>
            <p className={`leading-7`}>
              Aut fuga placeat fugit et labore. Accusantium nobis nulla aut.
              Numquam totam est beatae et eius. Vero impedit blanditiis
              consequatur exercitationem dolores. Dolorem magni fugiat ex
              incidunt.
            </p>
          </div>
          <div>
            <h2 className={`text-[30px] text-[400] text-pinkBgDark`}>
              Heading #
            </h2>
            <p className={`leading-7`}>
              Placeat aut ut rem quia consequatur tempore illo dolorem odio. Ex
              minus animi quia fuga est culpa. Optio odio rem reiciendis
              voluptate omnis sint dicta. Quam repellat deserunt laboriosam et.
              Voluptates et assumenda cupiditate quisquam libero explicabo
              reiciendis.
            </p>
          </div>
          <div>
            <h2 className={`text-[30px] text-[400] text-pinkBgDark`}>
              Download FoodieFinder for Free
            </h2>
            <p className={`leading-7`}>
              Et voluptatem molestiae temporibus cupiditate officiis. Hic non
              ipsam aut tempora et magni ut. Incidunt harum impedit temporibus
              in adipisci sit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
