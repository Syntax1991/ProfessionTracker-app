import {
  LoadingPanel
} from "../../../../apps/web/src/shared/components/LoadingPanel";
import {
  StatusMessage
} from "../../../../apps/web/src/shared/components/StatusMessage";
import {
  ProfessionCrafterWorkspace
} from "../details/components/ProfessionCrafterWorkspace";
import {
  useProfessionDetail
} from "../details/hooks/useProfessionDetail";
import {
  ProfessionModuleWorkspace
} from "../shared/components/ProfessionModuleWorkspace";

function CrafterFinderContent({
  professionId
}: {
  professionId: string;
}) {
  const {
    detail,
    isLoading,
    error
  } = useProfessionDetail(
    professionId
  );

  if (error) {
    return (
      <StatusMessage type="error">
        {error}
      </StatusMessage>
    );
  }

  if (isLoading || !detail) {
    return <LoadingPanel />;
  }

  return (
    <ProfessionCrafterWorkspace
      detail={detail}
      professionId={professionId}
    />
  );
}

export function ProfessionCrafterFinderPage() {
  return (
    <ProfessionModuleWorkspace
      description="Find the best guild crafter for a profession, recipe and target quality."
      eyebrow="CRAFTER COVERAGE"
      title="Crafter Finder"
    >
      {(profession) => (
        <CrafterFinderContent
          key={profession.id}
          professionId={
            profession.id
          }
        />
      )}
    </ProfessionModuleWorkspace>
  );
}
