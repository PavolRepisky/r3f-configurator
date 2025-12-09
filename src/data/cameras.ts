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
    position: [1.5, 1.6, 0.5],
    target: [4, 1.5, 0],
  },
  orbit: {
    position: [8, 8, 8],
    target: [0, 0, 0],
  },
};
