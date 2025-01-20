"use client";
import { ShieldCheckered } from "@phosphor-icons/react";
import Image from "next/image";
import React, { useState } from "react";

interface TokenImageProps {
  logoUrl?: string | null;
  tokenName?: string;
  width?: number;
  height?: number;
  className?: string;
}

const TokenImage: React.FC<TokenImageProps> = ({
  logoUrl,
  tokenName = "token",
  width = 24,
  height = 24,
  className,
}) => {
  const [imageError, setImageError] = useState<boolean>(false);

  if (!logoUrl || imageError) {
    return (
      <ShieldCheckered
        size={width}
        color="#FF7000"
        weight="fill"
        className={className}
      />
    );
  }

  return (
    <Image
      src={logoUrl}
      alt={tokenName}
      width={width}
      height={height}
      className={className}
      style={{ marginRight: "8px" }}
      onError={() => setImageError(true)}
      unoptimized
    />
  );
};

export default TokenImage;
