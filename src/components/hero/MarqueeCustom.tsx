import Marquee from "react-fast-marquee";
import Image from "next/image";

interface MarqueeComponentProps {
  icons: string[];
  direction: "left" | "right";
}

const MarqueeCustom: React.FC<MarqueeComponentProps> = ({ icons, direction }) => {
  return (
    <div className="w-full bg-white/5 py-10 backdrop-blur-sm">
      <Marquee gradient={false} speed={50} direction={direction} className="flex">
        <div className="flex items-center gap-16 px-8">
          {icons.map((icon, index) => (
            <div key={index} className="flex items-center justify-center w-[50px]">
              <Image
                src={icon}
                alt={`Technology ${index + 1}`}
                width={60}
                height={60}
                className="object-contain hover:scale-110 transition-transform duration-200"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-16 px-8 py-4">
          {icons.map((icon, index) => (
            <div key={`repeat-${index}`} className="flex items-center justify-center w-[50px]">
              <Image
                src={icon}
                alt={`Technology ${index + 1}`}
                width={60}
                height={60}
                className="object-contain hover:scale-110 transition-transform duration-200"
              />
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
};

export default MarqueeCustom;
