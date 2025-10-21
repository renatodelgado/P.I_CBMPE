import { ContainerPainel, PageTopHeader, PageTitle, PageSubtitle, ResponsiveRow, GridColumn, BoxInfo, Grid } from "../../components/EstilosPainel.styles";

export function GestaoUsuarios() {
    return (
        <>
            <ContainerPainel>

                <PageTopHeader>
                    <PageTitle>Gestão de Usuários</PageTitle>
                    <PageSubtitle>Gerencie contas, perfis e permissões no sistema.</PageSubtitle>
                </PageTopHeader>

                <ResponsiveRow>
                    <GridColumn weight={1}>
                        <BoxInfo>
                            <Grid>
                /* Filtro */
                            </Grid>
                        </BoxInfo>
                    </GridColumn>
                </ResponsiveRow>

                <ResponsiveRow>
                    <GridColumn weight={2}>
                        <BoxInfo>
                            <Grid>
                /* Peso 1 */
                            </Grid>
                        </BoxInfo>
                    </GridColumn>

                    <GridColumn weight={3}>
                        <BoxInfo>
                            <Grid>
                /* Peso 2 */
                            </Grid>
                        </BoxInfo>
                    </GridColumn>
                </ResponsiveRow>

                <ResponsiveRow>
                    <GridColumn weight={1}>
                        <BoxInfo>
                            <Grid>
                /* Tabela de usuários */
                            </Grid>
                        </BoxInfo>
                    </GridColumn>
                </ResponsiveRow>

            </ContainerPainel >

        </>
    );
}
