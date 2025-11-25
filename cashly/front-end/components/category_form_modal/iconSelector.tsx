import { Tooltip } from "@heroui/tooltip";
import {
  TagIcon,
  SparklesIcon,
  HomeIcon,
  BriefcaseIcon,
  ShoppingCartIcon,
  HeartIcon,
  StarIcon,
  BoltIcon,
  FireIcon,
  SunIcon,
  MoonIcon,
  CloudIcon,
  BeakerIcon,
  CakeIcon,
  GiftIcon,
  TrophyIcon,
  RocketLaunchIcon,
  MusicalNoteIcon,
  CameraIcon,
  BookOpenIcon,
  AcademicCapIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";

// Icone disponibili con i loro componenti
const AVAILABLE_ICONS = [
  { name: "home", Icon: HomeIcon, label: "Casa" },
  { name: "briefcase", Icon: BriefcaseIcon, label: "Lavoro" },
  { name: "shopping-cart", Icon: ShoppingCartIcon, label: "Shopping" },
  { name: "heart", Icon: HeartIcon, label: "Salute" },
  { name: "star", Icon: StarIcon, label: "Preferiti" },
  { name: "bolt", Icon: BoltIcon, label: "Energia" },
  { name: "fire", Icon: FireIcon, label: "Popolare" },
  { name: "sun", Icon: SunIcon, label: "Giorno" },
  { name: "moon", Icon: MoonIcon, label: "Notte" },
  { name: "cloud", Icon: CloudIcon, label: "Cloud" },
  { name: "beaker", Icon: BeakerIcon, label: "Ricerca" },
  { name: "cake", Icon: CakeIcon, label: "Cibo" },
  { name: "gift", Icon: GiftIcon, label: "Regalo" },
  { name: "trophy", Icon: TrophyIcon, label: "Obiettivi" },
  { name: "rocket", Icon: RocketLaunchIcon, label: "Progetti" },
  { name: "musical-note", Icon: MusicalNoteIcon, label: "Musica" },
  { name: "camera", Icon: CameraIcon, label: "Foto" },
  { name: "book-open", Icon: BookOpenIcon, label: "Lettura" },
  { name: "academic-cap", Icon: AcademicCapIcon, label: "Studio" },
  { name: "pencil", Icon: PencilIcon, label: "Scrittura" },
  { name: "sparkles", Icon: SparklesIcon, label: "Speciale" },
  { name: "tag", Icon: TagIcon, label: "Tag" },
];

// Componente per ottenere l'icona dal nome
export function getCategoryIcon(iconName?: string | null) {
  if (!iconName) return TagIcon;
  const icon = AVAILABLE_ICONS.find((i) => i.name === iconName);
  return icon?.Icon || TagIcon;
}

// Componente per selezionare l'icona
export default function IconSelector({ value, onChange }: { value: string; onChange: (icon: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-3">Seleziona Icona</label>
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-64 overflow-y-auto p-2 border border-default-200 rounded-lg">
        {AVAILABLE_ICONS.map(({ name, Icon, label }) => (
          <Tooltip key={name} content={label} placement="top">
            <button
              type="button"
              onClick={() => onChange(name)}
              className={`p-3 rounded-lg border-2 transition-all hover:scale-110 flex justify-center items-center cursor-pointer ${
                value === name ? "border-primary bg-primary/10" : "border-default-200 hover:border-default-400"
              }`}>
              <Icon className="w-6 h-6" />
            </button>
          </Tooltip>
        ))}
      </div>
      {value && <p className="text-sm text-default-500 mt-2">Icona selezionata: {value}</p>}
    </div>
  );
}
