import React from "react";

export default function SubjectIcon({ size, color }) {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={size}
        viewBox="0 -960 960 960"
        width={size}
        fill={color}
      >
        <path d="M420-160v-520H200v-120h560v120H540v520H420Z" />
      </svg>
    </div>
  );
}
