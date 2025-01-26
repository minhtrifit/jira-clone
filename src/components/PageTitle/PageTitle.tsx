interface PropType {
  title: string;
  description: string;
}

const PageTitle = (props: PropType) => {
  const { title, description } = props;

  return (
    <div>
      <h1 className="text-xl font-bold">{title}</h1>
      <h2 className="mt-2 text-sm font-semibold text-gray-400">
        {description}
      </h2>
    </div>
  );
};

export default PageTitle;
