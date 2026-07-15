/* eslint-disable @next/next/no-img-element */

import Image from "next/image";

import { Headline } from "@/components/atoms/headline/Headline";

type AdCardProps = {
  imgPath: string;
  alt: string;
  title: string;
  details: string;
};

export function AdCard({
  imgPath,
  alt,
  title,
  details,
}: AdCardProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <Image alt={alt} src={imgPath} width={56} height={56} />
      <div>
        <Headline tag="h4" className="mb-1">
          {title}
        </Headline>
        <p>{details}</p>
      </div>
    </div>
  );
}

export function GalleryCard({
  imgPath,
  alt,
}: Pick<AdCardProps, "imgPath" | "alt">): React.JSX.Element {
  return (
    <div className="basis-full md:basis-3/12 h-75 overflow-hidden">
      <img
        src={imgPath}
        alt={alt}
        className="w-full h-75 object-cover rounded-md"
      />
    </div>
  );
}
