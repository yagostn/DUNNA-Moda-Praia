"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/use-cart"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"
import { Trash2, ShoppingBag, CreditCard, QrCode, Banknote } from "lucide-react"
import { createWhatsAppLink } from "@/lib/whatsapp"
import { products } from "@/lib/products"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, validateAndCleanCart } = useCart()
  const [mounted, setMounted] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "cartao" | "debito" | "dinheiro" | null>(null)
  const [removedItems, setRemovedItems] = useState<string[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    // Verificar se há itens sem estoque no carrinho
    const itemsWithoutStock = cart.filter(item => {
      const product = products.find(p => p.id === item.id)
      return !product || product.stock <= 0
    })
    
    if (itemsWithoutStock.length > 0) {
      setRemovedItems(itemsWithoutStock.map(item => item.name))
      validateAndCleanCart()
      // Limpar a notificação após 5 segundos
      setTimeout(() => setRemovedItems([]), 5000)
    }
  }, [mounted, cart, validateAndCleanCart])

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Seu Carrinho</h1>
        <p>Carregando...</p>
      </div>
    )
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const isEmpty = cart.length === 0

  const handleCheckout = () => {
    if (!paymentMethod) {
      alert("Por favor, selecione um método de pagamento")
      return
    }

    const whatsappLink = createWhatsAppLink(cart, paymentMethod)
    window.open(whatsappLink, "_blank")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center sm:text-left">Seu Carrinho</h1>

      {removedItems.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 font-medium">
            Alguns itens foram removidos do seu carrinho pois estão esgotados:
          </p>
          <ul className="text-yellow-700 text-sm mt-2">
            {removedItems.map((itemName, index) => (
              <li key={index}>• {itemName}</li>
            ))}
          </ul>
        </div>
      )}

      {isEmpty ? (
        <div className="text-center py-16">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-medium mb-2">Seu carrinho está vazio</h2>
          <p className="text-muted-foreground mb-8">Parece que você ainda não adicionou nenhum item ao seu carrinho.</p>
          <Link href="/">
            <Button className="bg-white text-black hover:bg-gray-100">Continuar Comprando</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={`${item.id}-${item.size}-${item.color}`} className="p-4 flex gap-4 mx-auto">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  {/* Layout modificado para acomodar nomes longos */}
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
                    <h3 className="font-medium break-words pr-2">{item.name}</h3>
                    <div className="font-bold mt-1 sm:mt-0">{formatCurrency(item.price * item.quantity)}</div>
                  </div>
                    <div className="text-sm mt-1" style={{ color: "#7B3F00" }}>
                    {item.size && <span className="mr-2">Tamanho: {item.size}</span>}
                    {item.color && (
                      <span className="inline-flex items-center">
                        Cor:
                        <span
                          className="inline-block w-3 h-3 rounded-full ml-1"
                          style={{ backgroundColor: item.color }}
                        />
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item, Math.max(1, item.quantity - 1))}
                        className="h-8 w-8 rounded-none"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <div className="w-8 text-center">{item.quantity}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item, item.quantity + 1)}
                        className="h-8 w-8 rounded-none"
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {/* Botões em coluna no mobile, em linha no desktop */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 mt-4">
              <Button
                variant="outline"
                onClick={clearCart}
                className="bg-white text-[#7B3F00] hover:bg-gray-100 w-full sm:w-auto"
              >
                Limpar Carrinho
              </Button>
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="outline" className="bg-white text-[#7B3F00] hover:bg-gray-100 w-full">
                  Continuar Comprando
                </Button>
              </Link>
            </div>
          </div>

          <div>
            <Card className="p-6 sticky top-4 mx-auto max-w-md md:max-w-none">
              <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-bold mb-4">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Método de Pagamento</h3>
                  <RadioGroup
                    value={paymentMethod || ""}
                    onValueChange={(value) => setPaymentMethod(value as "pix" | "cartao" | "debito" | "dinheiro")}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="flex items-center cursor-pointer">
                        <QrCode className="h-4 w-4 mr-2" />
                        PIX
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="cartao" id="cartao" />
                      <Label htmlFor="cartao" className="flex items-center cursor-pointer">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Cartão de Crédito
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="debito" id="debito" />
                      <Label htmlFor="debito" className="flex items-center cursor-pointer">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Cartão de Débito
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dinheiro" id="dinheiro" />
                      <Label htmlFor="dinheiro" className="flex items-center cursor-pointer">
                        <Banknote className="h-4 w-4 mr-2" />
                        Dinheiro
                      </Label>
                    </div>
                  </RadioGroup>
                    {!paymentMethod && (
                      <p className="text-xs mt-2" style={{ color: "#7B3F00" }}>
                        Selecione um método de pagamento para continuar
                      </p>
                      )}
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                  disabled={!paymentMethod}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Finalizar Compra
                </Button>

                <p className="text-xs text-muted-foreground text-center font-bold mt-4">
                  Ao finalizar, você será redirecionado para o WhatsApp para confirmar seu pedido.
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}