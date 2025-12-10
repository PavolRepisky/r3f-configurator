import type { CameraView } from "@/types/configurator";

export const CAMERAS: Record<string, CameraView> = {
  exterior_far: {
    position: [10, 6, 14],
    target: [0, 1, 0],
  },
  exterior: {
    position: [6, 2, 9],
    target: [0, 1.5, 0],
  },
  interior: {
    position: [0.0, 14.35, 0.0],
    target: [0.0, 1.5, 0.0],
  },
  orbit: {
    position: [8, 8, 8],
    target: [0, 0, 0],
  },
};
