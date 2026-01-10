import { z } from "zod";

// --- HELPERS ---
const Vector3Tuple = z.tuple([z.number(), z.number(), z.number()]);

// --- SCHEMAS (NOW EXPECTING ARRAYS) ---

export const CurrencySchema = z.array(
  z.object({
    code: z.enum(["EUR", "USD", "CZK"]),
    symbol: z.string(),
    rate: z.number(),
  }),
);

export const StepSchema = z.array(
  z.object({
    id: z.string(),
    label: z.string(),
    featureIds: z.array(z.string()),
    cameraView: z.string(),
  }),
);

export const FeatureSchema = z.array(
  z.object({
    id: z.string(),
    label: z.string(),
    type: z.enum(["color", "toggle", "select"]),
    required: z.boolean().optional(),
    optionIds: z.array(z.string()),
  }),
);

export const OptionSchema = z.array(
  z.object({
    id: z.string(),
    label: z.string(),
    price: z.number().min(0),
    value: z.string().optional(),
    incompatibleWith: z.array(z.string()).optional(),
    rule: z
      .object({
        show: z.array(z.string()).optional(),
        hide: z.array(z.string()).optional(),
        setMaterialColor: z.record(z.string(), z.string()).optional(),
        materialVariants: z.record(z.string(), z.string()).optional(),
        transform: z
          .object({
            node: z.string(),
            position: Vector3Tuple.optional(),
            rotation: Vector3Tuple.optional(),
            scale: Vector3Tuple.optional(),
          })
          .optional(),
      })
      .optional(),
  }),
);

export const ModelSchema = z.array(
  z.object({
    id: z.string(),
    label: z.string(),
    description: z.string(),
    image: z.string().optional(),
    basePrice: z.number(),
    dimensions: Vector3Tuple,
    featureIds: z.array(z.string()),
    asset: z.object({
      file: z.string(),
      nodes: z.record(z.string(), z.array(z.string())).optional(),
      materials: z.record(z.string(), z.string()).optional(),
      hiddenNodes: z.array(z.string()).optional(),
    }),
    camera: z
      .object({
        exterior: Vector3Tuple.optional(),
        interior: Vector3Tuple.optional(),
      })
      .optional(),
  }),
);

// Updated CameraSchema with id field
export const CameraSchema = z.array(
  z.object({
    id: z.string(),
    position: Vector3Tuple,
    target: Vector3Tuple,
  }),
);
