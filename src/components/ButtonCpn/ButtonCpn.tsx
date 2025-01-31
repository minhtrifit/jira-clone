import { Button } from "@/components/ui/button";

interface PropType {
  icon?: React.ReactNode;
  type: "button" | "submit";
  title: string;
  loading?: boolean;
  onClick?: () => void;
}

const ButtonCpn = (props: PropType) => {
  const { icon, title, loading, onClick } = props;

  return (
    <Button className="dark:text-white" onClick={onClick} disabled={loading}>
      {icon && !loading && icon}
      {loading ? "Loading..." : title}
    </Button>
  );
};

export default ButtonCpn;
