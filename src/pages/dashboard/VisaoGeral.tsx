import { Breadcrumb } from "../../components/Breadcrumb";
import { ContainerPainel, PageTopHeader, PageTitle, PageSubtitle, ResponsiveRow, GridColumn, BoxInfo, Grid } from "../../components/EstilosPainel.styles";
import { useNavigate } from "react-router-dom";

export function VisaoGeral() {
    const navigate = useNavigate();

    return (
        <>
            <ContainerPainel>

                <PageTopHeader>
                          <Breadcrumb
                            items={[
                              { label: "Dashboard", onClick: () => navigate("/dashboard") },
                              { label: "Visão Geral" },
                            ]}
                          />

                          <PageTitle>Visão Geral</PageTitle>
                          <PageSubtitle>Visualize as informações do sistema.</PageSubtitle>
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
