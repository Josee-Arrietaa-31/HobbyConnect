import {
  Bike, Camera, BookOpen, Music, Utensils, Gamepad2, Telescope, Footprints, Heart,
} from "lucide-react";

export const LEVELS = ["principiante", "intermedio", "avanzado"];

export const LEVEL_STYLES = {
  principiante: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  intermedio: "bg-amber-100 text-amber-900 ring-amber-600/20",
  avanzado: "bg-rose-100 text-rose-800 ring-rose-600/20",
};

// Ícono por nombre de hobby (los hobbies vienen de la API)
const ICONS = {
  "Ciclismo de montaña": Bike,
  "Fotografía": Camera,
  "Lectura": BookOpen,
  "Senderismo": Footprints,
  "Música": Music,
  "Cocina": Utensils,
  "Videojuegos": Gamepad2,
  "Astronomía": Telescope,
};

export const hobbyIcon = (name) => ICONS[name] || Heart;
