import type { Option } from "@/types/configurator";

export const OPTIONS: Record<string, Option> = {
  // ==============================================
  // 1. EXTERIOR FINISHES
  // ==============================================
  opt_ext_white: {
    id: "opt_ext_white",
    label: "option.exterior.white", // "Matte White"
    price: 0,
    value: "#f3f4f6", // UI Color Swatch
    rule: {
      setMaterialColor: { Mat_Exterior_Cladding: "#ffffff" },
    },
  },
  opt_ext_wood: {
    id: "opt_ext_wood",
    label: "option.exterior.wood", // "Natural Wood"
    price: 1500,
    value: "#a16207",
    rule: {
      setMaterialColor: { Mat_Exterior_Cladding: "#854d0e" },
    },
  },
  opt_ext_metal: {
    id: "opt_ext_metal",
    label: "option.exterior.metal", // "Anthracite Metal"
    price: 850,
    value: "#374151",
    rule: {
      setMaterialColor: { Mat_Exterior_Cladding: "#1f2937" },
    },
  },

  // ==============================================
  // 2. EXTERIOR ADDONS (TECH)
  // ==============================================
  opt_solar: {
    id: "opt_solar",
    label: "option.addon.solar", // "Solar System (5kW)"
    price: 4200,
    rule: {
      show: ["Roof_Solar_Panels"],
    },
  },
  opt_ac: {
    id: "opt_ac",
    label: "option.addon.ac", // "Air Conditioning Unit"
    price: 1200,
    rule: {
      show: ["Ext_AC_Unit"],
    },
  },
  opt_security: {
    id: "opt_security",
    label: "option.addon.security", // "Smart Cameras & Locks"
    price: 650,
    rule: {
      show: ["Ext_Cameras", "Door_SmartLock"],
    },
  },

  // ==============================================
  // 3. INTERIOR LAYOUT
  // ==============================================
  opt_layout_open: {
    id: "opt_layout_open",
    label: "option.layout.open", // "Open Studio"
    price: 0,
    rule: {
      hide: ["Wall_Bedroom_Partition", "Door_Bedroom"],
    },
  },
  opt_layout_bedroom: {
    id: "opt_layout_bedroom",
    label: "option.layout.bedroom", // "Separate Bedroom"
    price: 800,
    rule: {
      show: ["Wall_Bedroom_Partition", "Door_Bedroom"],
    },
  },

  // ==============================================
  // 4. KITCHEN CONFIGURATION
  // ==============================================
  opt_kitchen_none: {
    id: "opt_kitchen_none",
    label: "option.kitchen.none", // "No Kitchen (Pre-wired)"
    price: 0,
    rule: {
      hide: ["Kitchen_Module_Base", "Kitchen_Island"],
    },
  },
  opt_kitchen_standard: {
    id: "opt_kitchen_standard",
    label: "option.kitchen.standard", // "Standard Kitchenette"
    price: 2800,
    rule: {
      show: ["Kitchen_Module_Base"],
      hide: ["Kitchen_Island"],
    },
  },
  opt_kitchen_island: {
    id: "opt_kitchen_island",
    label: "option.kitchen.island", // "Chef's Kitchen + Island"
    price: 4500,
    rule: {
      show: ["Kitchen_Module_Base", "Kitchen_Island"],
    },
    // LOGIC: Cannot select Island if "No Kitchen" is selected
    // (Handled by grouping, but good for reference)
  },

  // ==============================================
  // 5. INTERIOR DECOR / FLOORING
  // ==============================================
  opt_floor_light: {
    id: "opt_floor_light",
    label: "option.floor.light", // "Oak Herringbone"
    price: 0,
    value: "#eaddcf",
    rule: {
      setMaterialColor: { Mat_Floor_Interior: "#eaddcf" },
    },
  },
  opt_floor_dark: {
    id: "opt_floor_dark",
    label: "option.floor.dark", // "Dark Walnut"
    price: 600,
    value: "#5d4037",
    rule: {
      setMaterialColor: { Mat_Floor_Interior: "#5d4037" },
    },
  },
  opt_floor_stone: {
    id: "opt_floor_stone",
    label: "option.floor.stone", // "Grey Slate"
    price: 1100,
    value: "#78909c",
    rule: {
      setMaterialColor: { Mat_Floor_Interior: "#78909c" },
    },
  },
};
