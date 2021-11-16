import { CSSProperties } from 'react';

type Props = {
  src: string;
  alt: string;
  style: CSSProperties;
};

export function ClickableImage({ src, alt, style }: Props) {
  return <img src={src} alt={alt} style={style} />;
}
