import { Input } from "@heroui/input";
import { Tooltip } from "@heroui/tooltip";

import { SwatchIcon } from "@heroicons/react/24/solid";

// Palette colori predefiniti
const PRESET_COLORS = [
  "#EF4444", // red
  "#F97316", // orange
  "#F59E0B", // amber
  "#EAB308", // yellow
  "#84CC16", // lime
  "#22C55E", // green
  "#10B981", // emerald
  "#14B8A6", // teal
  "#06B6D4", // cyan
  "#0EA5E9", // sky
  "#3B82F6", // blue
  "#6366F1", // indigo
  "#8B5CF6", // violet
  "#A855F7", // purple
  "#D946EF", // fuchsia
  "#EC4899", // pink
  "#F43F5E", // rose
  "#64748B", // slate
];

// Componente per selezionare il colore
export default function ColorSelector({ value, onChange }: { value: string; onChange: (color: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-3">Seleziona Colore</label>
      <div className="space-y-3">
        {/* Palette colori predefiniti */}
        <div className="grid grid-cols-9 gap-2">
          {PRESET_COLORS.map((color) => (
            <Tooltip key={color} content={color} placement="top">
              <button
                type="button"
                onClick={() => onChange(color)}
                className={`w-10 h-10 rounded-full border-3 transition-all hover:scale-110 ${
                  value === color ? "border-white shadow-lg scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            </Tooltip>
          ))}
        </div>

        {/* Color picker personalizzato */}
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 w-16 cursor-pointer rounded-lg border-2 border-default-200"
          />
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            maxLength={7}
            className="flex-1"
            startContent={<SwatchIcon className="w-4 h-4" />}
          />
        </div>
      </div>
    </div>
  );
}
