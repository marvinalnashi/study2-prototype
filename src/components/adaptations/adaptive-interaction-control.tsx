import { VisibleSliderControl } from "@/components/adaptations/visible-slider-control";
import type { DetailLevel } from "@/types/prototype";

export function AdaptiveInteractionControl({
  detailLevel,
  onChange,
}: {
  detailLevel: DetailLevel | null;
  onChange: (level: DetailLevel) => void;
}) {
  return <VisibleSliderControl detailLevel={detailLevel} onChange={onChange} />;
}
