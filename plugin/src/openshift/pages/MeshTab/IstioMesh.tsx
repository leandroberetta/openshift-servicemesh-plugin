import * as React from 'react';
import { useParams, useLocation } from 'react-router-dom-v5-compat';
import { IstioConfigId } from 'types/IstioConfigDetails';
import { IstioConfigDetailsPage } from 'pages/IstioConfigDetails/IstioConfigDetailsPage';
import { setRouterBasename, useInitKialiListeners } from '../../utils/KialiIntegration';
import { KialiContainer } from 'openshift/components/KialiContainer';
import { ResourceURLPathProps, istioResources } from 'openshift/utils/IstioResources';
import { ErrorPage } from 'openshift/components/ErrorPage';
import { useKialiTranslation } from 'utils/I18nUtils';

const IstioConfigMeshTab: React.FC<void> = () => {
  const { t } = useKialiTranslation();
  const { pathname } = useLocation();
  const { name, ns, plural } = useParams<ResourceURLPathProps>();

  setRouterBasename(pathname);

  useInitKialiListeners();

  const errorPage = (
    <ErrorPage title={t('Istio detail error')} message={t('Istio object is not defined correctly')}></ErrorPage>
  );

  if (name && ns && plural) {
    const [group, version, kind] = plural.split('~');

    const istioResource = istioResources.find(
      item => item.group === group && item.version === version && item.kind === kind
    );

    if (istioResource) {
      const istioConfigId: IstioConfigId = {
        namespace: ns,
        objectGroup: group,
        objectKind: kind,
        objectName: name,
        objectVersion: version
      };

      return (
        <KialiContainer>
          <IstioConfigDetailsPage istioConfigId={istioConfigId}></IstioConfigDetailsPage>
        </KialiContainer>
      );
    } else {
      return errorPage;
    }
  } else {
    return errorPage;
  }
};

export default IstioConfigMeshTab;
