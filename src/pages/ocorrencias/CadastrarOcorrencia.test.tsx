jest.mock("leaflet/dist/leaflet.css", () => {});

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

jest.mock("react-leaflet", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MapContainer: ({ children }: any) => <div>{children}</div>,
  TileLayer: () => <div />,
  Marker: () => <div />,
}));


// Mocks for modules used by the component
jest.mock("axios");
jest.mock("../../utils/uploadToCloudinary", () => ({
  uploadToCloudinary: jest.fn().mockResolvedValue("https://cloudinary.test/assinatura.png"),
}));
jest.mock("../../utils/useOnlineStatus", () => ({
  useOnlineStatus: () => true,
}));
jest.mock("../../services/municipio_bairro", () => ({
  fetchMunicipiosPE: jest.fn().mockResolvedValue([]),
  fetchBairrosFromOSM: jest.fn().mockResolvedValue([]),
}));

import { NovaOcorrencia } from "./CadastrarOcorrencia";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedUpload = uploadToCloudinary as jest.MockedFunction<typeof uploadToCloudinary>;

beforeEach(() => {
  jest.clearAllMocks();
  // mock canvas toDataURL so save flow doesn't break
  HTMLCanvasElement.prototype.toDataURL = () => "data:image/png;base64,TEST";
  // mock fetch to handle data: URLs (canvas -> blob) and any other fetch calls safely
  global.fetch = jest.fn().mockImplementation((input: RequestInfo) => {
    const url = String(input);
    if (url.startsWith("data:")) {
      return Promise.resolve({
        ok: true,
        blob: async () => new Blob([""], { type: "image/png" }),
      });
    }
    return Promise.resolve({
      ok: true,
      json: async () => [],
    });
  }) as jest.Mock;
  // prevent real alerts
  window.alert = jest.fn();
});

test("carrega opções e salva ocorrência (envia POST)", async () => {
  // Prepare mocked API responses for axios.get calls (by URL)
  mockedAxios.get.mockImplementation((url: string) => {
    if (url.includes("/viaturas")) {
      return Promise.resolve({ data: [{ id: 120, tipo: "MR", numero: "1031" }] });
    }
    if (url.includes("/unidadesoperacionais")) {
      return Promise.resolve({ data: [{ id: 10, nome: "2º GB - 2º Grupamento de Bombeiros", sigla: "2GB", pontoBase: "Caruaru" }] });
    }
    if (url.includes("/naturezasocorrencias")) {
      return Promise.resolve({ data: [{ id: 3, nome: "Incêndio" }] });
    }
    if (url.includes("/gruposocorrencias")) {
      return Promise.resolve({ data: [{ id: 20, nome: "Incêndio em Meio de Transporte Terrestre", naturezaOcorrencia: { id: 3 } }] });
    }
    if (url.includes("/subgruposocorrencias")) {
      return Promise.resolve({ data: [{ id: 30, nome: "Incêndio em Veículo", grupoOcorrencia: { id: 20 } }] });
    }
    if (url.includes("/lesoes")) {
      return Promise.resolve({ data: [] });
    }
    // default
    return Promise.resolve({ data: [] });
  });

  // mock POST for ocorrencias
  mockedAxios.post.mockResolvedValueOnce({ data: { id: 555 } });

  // render component
  render(
    <MemoryRouter>
      <NovaOcorrencia />
    </MemoryRouter>
  );

  // wait for naturezas to load and show option text
  expect(await screen.findByText("Incêndio")).toBeInTheDocument();

  // select Natureza -> Grupo -> Subgrupo -> Unidade -> Número da Viatura
  await userEvent.selectOptions(screen.getByLabelText(/Natureza da Ocorrência/i), "3");
  await userEvent.selectOptions(screen.getByLabelText(/Grupo da Ocorrência/i), "20");
  await userEvent.selectOptions(screen.getByLabelText(/Subgrupo da Ocorrência/i), "30");
  await userEvent.selectOptions(screen.getByLabelText(/Unidade Operacional/i), "10");
  await userEvent.selectOptions(screen.getByLabelText(/Número da Viatura/i), "120");

  // fill some optional text (description) so payload contains something
  await userEvent.type(screen.getByLabelText(/Descrição Resumida/i), "Teste de incêndio em veículo");

  // Click "Salvar Ocorrência"
  const btn = screen.getByRole("button", { name: /Salvar Ocorrência/i });
  await userEvent.click(btn);

  // expect POST request to ocorrencias endpoint to be performed
  await waitFor(() => {
    expect(mockedAxios.post).toHaveBeenCalled();
  });

  const calledUrl = mockedAxios.post.mock.calls[0][0] as string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calledPayload = mockedAxios.post.mock.calls[0][1] as any;

  expect(calledUrl).toContain("/ocorrencias");
  expect(calledPayload).toMatchObject({
    descricao: "Teste de incêndio em veículo",
    naturezaOcorrenciaId: 3,
    grupoOcorrenciaId: 20,
    subgrupoOcorrenciaId: 30,
    unidadeOperacionalId: 10,
    viaturaId: 120,
  });

  // uploadToCloudinary should have been called for the canvas signature (mocked)
  expect(mockedUpload).toHaveBeenCalled();

  // final success alert
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Ocorrência salva com sucesso"));
  });
});