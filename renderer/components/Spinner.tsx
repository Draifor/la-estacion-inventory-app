import React from "react";
import SpinnerIcon from "@/components/icons/SpinnerIcon";

export default function Spinner({ className }) {
  return <SpinnerIcon className={`${className} animate-spin`} />;
}
