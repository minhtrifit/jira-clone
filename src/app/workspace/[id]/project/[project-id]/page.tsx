"use client";

import { useParams } from "next/navigation";

const DetailProjectPage = () => {
  const params = useParams();

  console.log(params);

  return <div>Detail project page</div>;
};

export default DetailProjectPage;
