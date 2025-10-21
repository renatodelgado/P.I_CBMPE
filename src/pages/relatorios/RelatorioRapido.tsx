import { Breadcrumb } from "../../components/Breadcrumb";
import { ContainerPainel, PageTopHeader, PageTitle, PageSubtitle, ResponsiveRow, GridColumn, BoxInfo, Grid } from "../../components/EstilosPainel.styles";
import { useNavigate } from "react-router-dom";

export function RelatorioRapido() {
    const navigate = useNavigate();

    return (
        <>
            <ContainerPainel>

                <PageTopHeader>
                          <Breadcrumb
                            items={[
                              { label: "Relatórios", onClick: () => navigate("/relatorios") },
                              { label: "Relatório Rápido" },
                            ]}
                          />

                          <PageTitle>Relatório Rápido</PageTitle>
                          <PageSubtitle>Visualize as informações do relatório rápido.</PageSubtitle>
                        </PageTopHeader>

                <ResponsiveRow>
                    <GridColumn weight={1}>
                        <BoxInfo>
                            <Grid>
                /* Area 1 */
                            </Grid>
                        </BoxInfo>
                    </GridColumn>
                </ResponsiveRow>

                <ResponsiveRow>
                    <GridColumn weight={2}>
                        <BoxInfo>
                            <Grid>
                /* Area 2 Peso 1 */
                            </Grid>
                        </BoxInfo>
                    </GridColumn>

                    <GridColumn weight={3}>
                        <BoxInfo>
                            <Grid>
                /* Area 2 Peso 2 */
                            </Grid>
                        </BoxInfo>
                    </GridColumn>
                </ResponsiveRow>

                <ResponsiveRow>
                    <GridColumn weight={1}>
                        <BoxInfo>
                            <Grid>
                /* Area 3 */
                            </Grid>
                        </BoxInfo>
                    </GridColumn>
                </ResponsiveRow>

            </ContainerPainel >

        </>
    );
}
