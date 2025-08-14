import type { CartItem } from "./types"
import { formatCurrency } from "./utils"

// Substitua pelo seu número de WhatsApp (com código do país)
const WHATSAPP_NUMBER = "5548991961687"

// Color mapping to convert hex to readable name
const COLOR_MAP: { [key: string]: string } = {
  "#FF69B4": "Rosa bebê",
  "#FAF9F6": "Off White",
  "#89CFF0": "Azul Bebê",
  "#392620": "Marrom café",
  "#FFFF00": "Amarelo",
  "#C8E5EB": "Azul Cristal",
  "#00FFFF": "Ciano",
  "#A020F0": "Roxo",
  "#514240": "café",
  "#048000": "Verde Escuro",
  "#000080": "Azul Marinho",
  "#4169E1": "Azul Royal",
  "#5B3C1D": "Marrom",
  "#FF0000": "Vermelho",
  "#000000": "Preto",
  "#E2725B": "Telha",
  "#808080": "Cinza",
  "#EBC8B2": "Nude",
  "#FFFFFF": "Branco",
  "#0000FF": "Azul",
  "#F5F5DC": "Bege",    
  "#EA72BCFF": "Rosa Claro",
  "#006400": "Verde Escuro",
  "#993399": "Roxo"

}

// Function to convert hex color to readable name
function getColorName(hexColor?: string): string {
  if (!hexColor) return ""
  
  // Normalize the hex color format
  let normalizedColor = hexColor.toUpperCase()
  
  // Remove any extra characters and ensure proper hex format
  if (normalizedColor.startsWith("#")) {
    normalizedColor = normalizedColor.substring(1)
  }
  
  // Ensure it's exactly 6 characters (remove extra characters if any)
  if (normalizedColor.length > 6) {
    normalizedColor = normalizedColor.substring(0, 6)
  }
  
  // Add back the # prefix
  normalizedColor = "#" + normalizedColor
  
  return COLOR_MAP[normalizedColor] || hexColor
}

export function createWhatsAppLink(
  cart: CartItem[], 
  paymentMethod?: "pix" | "cartao" | "dinheiro" | "debito" | null,
  customerName?: string,
  customerPhone?: string,
  deliveryType?: "entrega" | "entregaInterior" | "retirada",
  address?: { rua: string; numero: string; bairro: string; cidade: string },
  interiorCity?: string
): string {
  if (cart.length === 0) return ""

  // Calculate totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0)

  // Get current date and time
  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  // Create WhatsApp message
  let message = `*Dunna Praia - Confirmação de Pedido*\n\n`

  // Customer Information
  if (customerName) message += `*Nome do Cliente:* ${customerName}\n`
  if (customerPhone) message += `*Telefone:* ${customerPhone}\n\n`

  // Order Details
  message += `*Data do Pedido:* ${formattedDate}\n\n`

  // Cart Items
  message += `*Itens do Pedido:*\n`
  cart.forEach((item, index) => {
    message += `*${index + 1}. ${item.name}*\n`
    message += `   Quantidade: ${item.quantity}\n`
    if (item.size) message += `   Tamanho: ${item.size}\n`
    if (item.color) message += `   Cor: ${getColorName(item.color)}\n`
    message += `   Valor: ${formatCurrency(item.price)}\n\n`

  })

  // Order Summary
  message += '  •*RESUMO DO PEDIDO:*\n'
  message += `   Quantidade Total de Peças: ${totalQuantity}\n`
  message += `   *Valor Total: ${formatCurrency(subtotal)}*\n\n`

  // Payment Method
  if (paymentMethod) {
    let paymentMethodText = ""

    switch (paymentMethod) {
      case "pix":
        paymentMethodText = "PIX"
        break
      case "cartao":
        paymentMethodText = "Cartão de Crédito"
        break
      case "debito":
        paymentMethodText = "Cartão de Débito"
        break
      case "dinheiro":
        paymentMethodText = "Dinheiro"
        break
    }

    message += `*Método de Pagamento:* ${paymentMethodText}\n\n`
  }

  // Delivery Information
  if (deliveryType) {
    message += `*Informações de Entrega/Retirada:*\n`
    
    switch (deliveryType) {
      case "entrega":
        message += `Tipo: Entrega (Capital)\n`
        if (address) {
          message += `Endereço: ${address.rua}, ${address.numero}\n`
          message += `Bairro: ${address.bairro}\n`
          message += `Cidade: ${address.cidade}\n`
        }
        break
      case "entregaInterior":
        message += `Tipo: Entrega (Interior)\n`
        if (interiorCity) {
          message += `Cidade: ${interiorCity}\n`
        }
        message += `*Obs: Frete por conta do cliente*\n`
        break
      case "retirada":
        message += `Tipo: Retirada\n`
        message += `Local: Rua Lions Club, 51 Ocean Residence\n`
        message += `Endereço: Atalaia, Aracaju, Sergipe 49037-420\n`
        break
    }
    message += `\n`
  }

  // Closing message
  message += `*Obrigado por escolher a Dunna Praia!* \n`
  message += `Confirma o pedido? 💖\n`

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message)

  // Create WhatsApp link
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
}