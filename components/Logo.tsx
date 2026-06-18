import Image from 'next/image';

interface LogoProps {
  size?: 'navbar' | 'footer';
  light?: boolean;
}

export default function Logo({ size = 'navbar', light = false }: LogoProps) {
  const sizeConfig = {
    navbar: {
      width: 360,
      height: 120,
      className: 'h-[6.5rem] md:h-28 w-auto object-contain transition-all duration-500',
    },
    footer: {
      width: 180,
      height: 72,
      className: 'h-16 w-auto object-contain',
    },
  };

  const config = sizeConfig[size];

  return (
    <div className="flex items-center p-0 m-0 leading-none">
      <Image
        src="/fd_makan_logo-removebg-preview.png"
        alt="FD MAKAN Logo"
        width={config.width}
        height={config.height}
        className={`${config.className} ${light ? 'brightness-0 invert' : ''}`}
        priority={size === 'navbar'}
      />
    </div>
  );
}
