import {
  Link,
  useParams
} from "react-router-dom";
import {
  LoadingPanel
} from "../../../shared/components/LoadingPanel";
import {
  PageHeader
} from "../../../shared/components/PageHeader";
import {
  StatusMessage
} from "../../../shared/components/StatusMessage";
import {
  ProfessionDetailWorkspace
} from "../components/ProfessionDetailWorkspace";
import {
  useProfessionDetail
} from "../hooks/useProfessionDetail";

function getCategoryLabel(
  category: string
): string {
  return category === "GATHERING"
    ? "Sammelberuf"
    : "Herstellungsberuf";
}

export function ProfessionDetailPage() {
  const {
    professionId
  } = useParams<{
    professionId: string;
  }>();

  const {
    detail,
    isLoading,
    error
  } =
    useProfessionDetail(
      professionId
    );

  if (!professionId) {
    return (
      <>
        <PageHeader
          eyebrow="BERUFSDETAIL"
          title="Beruf"
        />

        <StatusMessage type="error">
          Die Berufs-ID fehlt.
        </StatusMessage>
      </>
    );
  }

  if (
    isLoading ||
    !detail
  ) {
    return (
      <>
        <PageHeader
          eyebrow="BERUFSDETAIL"
          title="Beruf wird geladen"
        />

        {error ? (
          <StatusMessage type="error">
            {error}
          </StatusMessage>
        ) : (
          <LoadingPanel />
        )}
      </>
    );
  }

  return (
    <>
      <PageHeader
        actions={
          <Link
            className="button button-secondary"
            to="/professions"
          >
            Zurück zu Berufen
          </Link>
        }
        description={
          `${getCategoryLabel(detail.profession.category)} · Crafting-Daten kompakt verwalten`
        }
        eyebrow="BERUFSDETAIL"
        title={
          detail.profession.name
        }
      />

      {error && (
        <StatusMessage type="error">
          {error}
        </StatusMessage>
      )}

      <ProfessionDetailWorkspace
        detail={detail}
        professionId={
          professionId
        }
      />
    </>
  );
}