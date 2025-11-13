type Props = React.HTMLAttributes<HTMLDivElement> & {
  w?: number | string;
  h?: number | string;
  rounded?: string;
};

export default function Skeleton({ w = "100%", h = 14, rounded = "0.5rem", className = "", ...rest }: Props) {
  const style = { width: typeof w === "number" ? `${w}px` : w, height: typeof h === "number" ? `${h}px` : h, borderRadius: rounded };
  return <div className={`xc-skeleton ${className}`} style={style} {...rest} />;
}
