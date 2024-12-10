import { canViewFeature, FeatureFlagName } from "@/lib/featureFlag"
import { getFeatureRole } from "@/lib/getFeatureRole"
import { ReactNode } from "react"

export function FeatureEnabled({
    featureFlag,
    children,
}: {
    featureFlag: FeatureFlagName
    children: ReactNode
}) {
    return canViewFeature(featureFlag, getFeatureRole()) ? children : null
}