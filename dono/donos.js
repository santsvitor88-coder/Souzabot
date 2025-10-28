// 🔐 donos.js — Reconhecimento de dono por número e LID

// Adicione aqui o(s) dono(s) do bot
const DONOS = [
  "5521971525709",           // Número puro (exemplo)
  "120363403381125311@lid",  // LID completo (exemplo)
]

// 🧩 Função que verifica se o remetente é dono
function isDono(sender) {
  if (!sender) return false
  return DONOS.some(dono => sender.includes(dono.replace(/[^0-9@a-zA-Z]/g, '')))
}

// Exporta para o index.js
export { DONOS, isDono }
  
