"use client"

import type React from "react"
import Image from "next/image"
import styles from "./image-zoom.module.css"

interface ImageZoomProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt, width, height, className = "" }) => {
  // Removido efeito de zoom e eventos relacionados

  return (
    <div
      className={`${styles.imageContainer} ${className}`}
      style={{ width: width ? `${width}px` : "100%", height: height ? `${height}px` : "100%" }}
    >
      <div className="relative w-full h-full">
        <Image src={src || "/placeholder.svg"} alt={alt} fill style={{ objectFit: "cover" }} />
      </div>
    </div>
  )
}

export default ImageZoom

