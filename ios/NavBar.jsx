import Image from "next/image";
import Link from "next/link";
import React from "react";

function NavBar() {
  return (
    <nav className="tw-flex tw-px-20 tw-flex-row tw-bg-white tw-justify-between tw-pt-5 tw-sticky tw-top-0 tw-z-50 tw-pb-5">
      <Link href="/home">
        <Image
          className="tw-object-contain tw-cursor-pointer "
          src={"/logo.png"}
          width={230}
          height={230}
          alt="logo.png"
        />
      </Link>

      <ul className="tw-flex tw-flex-row tw-text-lg tw-font-medium tw-items-center ">
        <li className="tw-mx-7 tw-cursor-pointer ">
          <Link className=" tw-no-underline tw-text-black" href="/about">
            About us
          </Link>
        </li>
        <li className="tw-mx-7 tw-cursor-pointer">Sign Up</li>
        <li className="tw-mx-7 tw-bg-primary hover:tw-bg-buttonHover tw-text-white tw-font-normal tw-cursor-pointer tw-px-10 tw-py-3 tw-rounded-lg">
          <Link className=" tw-no-underline tw-text-white" href="/login">
            Sign In
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
