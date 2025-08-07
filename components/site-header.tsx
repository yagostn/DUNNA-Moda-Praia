"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/use-cart"
import { useState, useEffect } from "react"

export default function SiteHeader() {
  const { cart } = useCart()
  const [cartCount, setCartCount] = useState(0)

  // Atualizar o contador do carrinho
  useEffect(() => {
    setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0))
  }, [cart])

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-15 items-center justify-between w-full px-0">
        <div className="flex items-center ml-3">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo1.png"
              alt="dunna Logo"
              width={120} 
              height={400}
              className="h-auto w-auto object-contain"
              priority
            />
          </Link>
        </div>
        <div className="flex items-center gap- mr-10">
          <Link href="/carrinho">
            <Button variant="ghost" size="icon" className="relative hover:bg-transparent hover:cursor-pointer">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Carrinho</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}