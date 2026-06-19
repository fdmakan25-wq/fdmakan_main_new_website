import Image from 'next/image';

interface LogoProps {
  size?: 'navbar' | 'footer';
  light?: boolean;
}

export default function Logo({ size = 'navbar', light = false }: LogoProps) {
  const sizeConfig = {
    navbar: {
      width: 280,
      height: 90,
      className: 'h-14 md:h-16 w-auto object-contain transition-all duration-500',
    },
    footer: {
      width: 240,
      height: 96,
      className: 'h-20 md:h-24 w-auto object-contain',
    },
  };

  const config = sizeConfig[size];

  return (
    <div className="flex items-center p-0 m-0 leading-none">
      <Image
        src="/fd_makan-wobg.png"
        alt="FD MAKAN Logo"
        width={config.width}
        height={config.height}
        className={`${config.className} ${light ? 'brightness-0 invert' : ''}`}
        priority={size === 'navbar'}
      />
    </div>
  );
}
