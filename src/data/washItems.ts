import type { WashItem } from "../types/wash";

export const washItems: WashItem[] = [
  { type: "light_clothes", name: "Ropa liviana", icon: "👕", shortDescription: "Remeras, ropa interior, prendas finas.", category: "clothes" },
  { type: "heavy_clothes", name: "Ropa pesada", icon: "🧥", shortDescription: "Buzos, jeans, camperas livianas.", category: "clothes" },
  { type: "sneakers", name: "Zapatillas", icon: "👟", shortDescription: "Secado lento y mejor con sol indirecto.", category: "object" },
  { type: "sheets", name: "Sábanas", icon: "🛏️", shortDescription: "Textiles amplios, secan bien con viento.", category: "textile" },
  { type: "towels", name: "Toallas", icon: "🧺", shortDescription: "Muy sensibles a humedad alta.", category: "textile" },
  { type: "quilts", name: "Acolchados", icon: "🛌", shortDescription: "Necesitan muchas horas secas.", category: "textile" },
  { type: "rugs", name: "Alfombras", icon: "▥", shortDescription: "Exigen baja humedad y buen aireado.", category: "textile" },
  { type: "curtains", name: "Cortinas", icon: "🪟", shortDescription: "Conviene con brisa moderada.", category: "textile" },
  { type: "sofa_covers", name: "Fundas de sillón", icon: "🛋️", shortDescription: "Textil pesado, ojo con humedad.", category: "textile" },
  { type: "outdoor_textiles", name: "Textiles de exterior", icon: "⛱️", shortDescription: "Almohadones, lonas y telas de patio.", category: "textile" },
  { type: "car", name: "Auto", icon: "🚗", shortDescription: "Importa lluvia, polvo, viento y sol directo.", category: "vehicle" },
  { type: "bike", name: "Bicicleta", icon: "🚲", shortDescription: "Secar bien partes metálicas.", category: "vehicle" },
  { type: "motorcycle", name: "Moto", icon: "🏍️", shortDescription: "Evitar lluvia cercana y polvo.", category: "vehicle" },
  { type: "scooter", name: "Monopatín", icon: "🛴", shortDescription: "Cuidado con humedad en partes eléctricas.", category: "vehicle" },
  { type: "toys", name: "Juguetes", icon: "🧸", shortDescription: "Mejor con sol suave y aireado.", category: "object" },
  { type: "plushies", name: "Peluches", icon: "🐻", shortDescription: "Secado interno lento.", category: "object" },
  { type: "pet_beds", name: "Camas de mascotas", icon: "🐾", shortDescription: "Necesitan secado profundo.", category: "textile" },
  { type: "backpacks", name: "Mochilas/accesorios", icon: "🎒", shortDescription: "Evitar sol extremo y humedad.", category: "object" }
];
