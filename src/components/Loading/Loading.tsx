import Image from "next/image";
interface PropType {
  width: number;
  height: number;
}

const Loading = (props: PropType) => {
  return (
    <div className="flex flex-col items-center gap-5">
      <Image src="/logo.png" width={200} height={200} alt="app-logo" />
      <span className="text-lg font-semibold">Loading...</span>
    </div>
  );
};

export default Loading;
