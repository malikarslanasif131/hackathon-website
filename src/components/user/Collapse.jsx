import { RiArrowDownSLine } from "react-icons/ri";
const Collapse = ({ text, children, setExpand, expand }) => {
  return (
    <div className="w-full bg-white rounded-xl p-4 drop-shadow-md">
      <div
        className="flex items-center justify-between cursor-pointer text-xl font-bold"
        onClick={() => setExpand(text === expand ? "" : text)}
      >
        {text}
        <RiArrowDownSLine
          className={`${text === expand && "rotate-180"} duration-300 text-2xl`}
        />
      </div>
      <div
        className={`${
          text === expand ? "max-h-[1000px]" : "max-h-0"
        } duration-500 transition-[max-height] overflow-hidden`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Collapse;
