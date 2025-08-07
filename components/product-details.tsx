"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { formatCurrency, calculateInstallments } from "@/lib/utils"
import { useCart } from "@/lib/use-cart"
import { ShoppingCart, Check, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ProductDetailsProps {
  product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter()
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes.length > 0 ? product.sizes[0] : null)
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors.length > 0 ? product.colors[0] : null,
  )
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const isOutOfStock = product.stock <= 0
  const maxQuantity = Math.max(0, product.stock)

  const handleAddToCart = () => {
    if (isOutOfStock) return
    if (!selectedSize && product.sizes.length > 0) return
    if (!selectedColor && product.colors.length > 0) return
    if (quantity > maxQuantity) return

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      size: selectedSize,
      color: selectedColor,
    })

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleBuyNow = () => {
    if (isOutOfStock) return
    handleAddToCart()
    router.push("/carrinho")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-1.5xl font-bold">{product.name}</h1>
          <p className="text-xl font-bold mt-2">{formatCurrency(product.price)}</p>
          <p className="text-sm text-muted-foreground">
            {calculateInstallments(product.price)} 
          </p>
        </div>
        {isOutOfStock ? (
          <Badge variant="destructive" className="text-sm px-3 py-1">
            ESGOTADO
          </Badge>
        ) : (
          <Badge variant="outline" className="text-sm px-3 py-1 bg-white text-black border-gray-300">
            {product.stock} {product.stock === 1 ? "item" : "itens"} em estoque
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        <p
          style={{
            fontFamily: "Arial, serif",
            lineHeight: 1.6,
            fontSize: "1rem",
            color: "#7B3F00",
          }}
        >
          {product.description.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>

        {isOutOfStock && (
          <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-md">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm">Este produto está temporariamente esgotado.</p>
          </div>
        )}

        {product.sizes.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Tamanho</h3>
            <RadioGroup
              value={selectedSize || ""}
              onValueChange={setSelectedSize}
              className="flex flex-wrap gap-2"
              disabled={isOutOfStock}
            >
              {product.sizes.map((size) => (
                <div key={size} className="flex items-center">
                  <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                  <Label
                    htmlFor={`size-${size}`}
                    className={`flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white 
                    peer-data-[state=checked]:bg-black peer-data-[state=checked]:text-white 
                    hover:bg-gray-100 cursor-pointer ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {product.colors.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Cor</h3>
            <RadioGroup
              value={selectedColor || ""}
              onValueChange={setSelectedColor}
              className="flex flex-wrap gap-3"
              disabled={isOutOfStock}
            >
              {product.colors.map((color) => (
                <div key={color} className="flex items-center">
                  <RadioGroupItem value={color} id={`color-${color}`} className="peer sr-only" />
                  <Label
                    htmlFor={`color-${color}`}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border border-muted 
                    peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary 
                    hover:ring-1 hover:ring-muted-foreground cursor-pointer ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && <Check className="h-4 w-4 text-white drop-shadow-md" />}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {!isOutOfStock && (
          <div>
            <h3 className="font-medium mb-2">Quantidade</h3>
            <div className="flex items-center border rounded-md w-32 bg-white text-black">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-10 rounded-none"
                disabled={quantity <= 1}
              >
                -
              </Button>
              <div className="flex-1 text-center">{quantity}</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                className="h-10 rounded-none"
                disabled={quantity >= maxQuantity}
              >
                +
              </Button>
            </div>
            {quantity === maxQuantity && (
              <p className="text-xs text-muted-foreground mt-1 font-bold">Quantidade máxima disponível</p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Button onClick={handleAddToCart}
          className="flex-1 bg-[#614e37] text-white hover:bg-[#633200]"
          disabled={isOutOfStock || addedToCart}
        >
          {addedToCart ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Adicionado
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" /> Adicionar ao Carrinho
            </>
          )}
        </Button>
        <Button onClick={handleBuyNow} variant="secondary" className="flex-1" disabled={isOutOfStock}>
          Comprar Agora
        </Button>
      </div>
    </div>
  )
}