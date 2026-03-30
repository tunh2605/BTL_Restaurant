import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-36 mt-40 w-full">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-14">
        <div className="md:max-w-96">
          <img alt="logo" className="w-36 h-auto" src={assets.restaurantLogo} />
          <p className="mt-6 text-sm">
            Tại DoMasala, mỗi bữa ăn là một câu chuyện — câu chuyện về hương
            thơm, màu sắc và tâm huyết của nền ẩm thực Ấn Độ truyền thống được
            nấu với trái tim. Chúng tôi không chỉ phục vụ món ăn, chúng tôi mang
            đến cảm giác được chào đón như trong một ngôi nhà ấm áp — nơi từng
            nồi curry sánh đặc, từng vị masala nồng nàn đều được gìn giữ như
            công thức gia truyền qua nhiều thế hệ.
          </p>
        </div>
        <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
          <div>
            <h2 className="font-semibold mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About us</a>
              </li>
              <li>
                <a href="#">Contact us</a>
              </li>
              <li>
                <a href="#">Privacy policy</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-5">Thông Tin Liên Hệ</h2>
            <div className="text-sm space-y-2">
              <p>+84 333444555</p>
              <p>DoMasala@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <p className="pt-4 text-center text-sm pb-5">
        Copyright {new Date().getFullYear()} ©{" "}
        <a href="https://prebuiltui.com">DoMasala</a>. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
