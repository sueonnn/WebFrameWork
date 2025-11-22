import React from "react";

const BackButton = () => {
  return (
    <button
      onClick={() => window.history.back()}
      className="
        inline-flex items-center gap-2
        px-5 py-2
        rounded-full
        bg-[#F4F4F7]
        text-[#5A60FF] font-semibold
        shadow-sm
        hover:shadow
        transition-all
      "
    >
      <span className="text-lg">←</span> 돌아가기
    </button>
  );
};

export default BackButton;
