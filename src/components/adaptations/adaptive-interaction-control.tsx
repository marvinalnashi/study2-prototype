import { VisibleSliderControl } from "@/components/adaptations/visible-slider-control";
import { ProfileControl } from "@/components/adaptations/profile-control";
import type { ControlVariant, DetailLevel } from "@/types/prototype";

export function AdaptiveInteractionControl({
  controlVariant,
  detailLevel,
  onChange,
}: {
  controlVariant: ControlVariant;
  detailLevel: DetailLevel;
  onChange: (level: DetailLevel) => void;
}) {
  if (controlVariant === "profiles") {
    return <ProfileControl detailLevel={detailLevel} onChange={onChange} />;
  }

  return <VisibleSliderControl detailLevel={detailLevel} onChange={onChange} />;
}
