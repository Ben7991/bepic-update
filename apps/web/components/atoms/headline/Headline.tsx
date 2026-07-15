type HeadlineTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadlineProps = {
  tag: HeadlineTag;
  children: React.ReactNode;
  className?: string;
};

export function Headline({
  className,
  tag,
  children,
}: HeadlineProps): React.JSX.Element {
  switch (tag) {
    case "h1":
      return (
        <h1 className={`font-semibold text-black text-[2em] ${className}`}>
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 className={`font-semibold text-black ${className}`}>{children}</h2>
      );
    case "h3":
      return (
        <h3 className={`font-semibold text-black text-2xl ${className}`}>
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4 className={`font-semibold text-black text-xl ${className}`}>
          {children}
        </h4>
      );
    case "h5":
      return (
        <h5 className={`font-semibold text-black ${className}`}>{children}</h5>
      );
    case "h6":
      return (
        <h6 className={`font-semibold text-black ${className}`}>{children}</h6>
      );
    default:
      throw new Error("Please ensure that a tag is provided");
  }
}
