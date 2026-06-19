'use client';

import Image, { ImageProps } from 'next/image';
import { isOptimizableImage } from '@/lib/allowed-image-hosts';

type SafeImageProps = Omit<ImageProps, 'src'> & {
  src: string;
};

export default function SafeImage({ src, alt, ...props }: SafeImageProps) {
  if (isOptimizableImage(src)) {
    return <Image src={src} alt={alt} {...props} />;
  }

  const { fill, width, height, className, style, sizes, priority, placeholder, blurDataURL, loader, quality, ...rest } = props;

  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt || ''}
        className={className}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          ...(style as React.CSSProperties),
        }}
        {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || ''}
      width={typeof width === 'number' ? width : undefined}
      height={typeof height === 'number' ? height : undefined}
      className={className}
      style={style as React.CSSProperties}
      {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)}
    />
  );
}
