import React from "react";
import SpinnerIcon from "@/app/components/icons/SpinnerIcon";

export default function Spinner({ className }) {
  return (
    <SpinnerIcon className={`${className} animate-spin`} />
  );
}
