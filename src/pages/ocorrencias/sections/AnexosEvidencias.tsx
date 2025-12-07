/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// File: src/components/sections/AnexosEvidencias.tsx
import { useEffect, useRef, useState } from "react";
import { PaperclipIcon } from "@phosphor-icons/react";
import { BoxInfo, SectionTitle, SectionSubtitle, UploadArea, PreviewList, Divider, SignatureBox, SignatureActions, ModalOverlay, ModalContent } from "../../../components/EstilosPainel.styles";
import { Button } from "../../../components/Button";

type UploadedFile = {
  file?: File;
  url?: string;
  name: string;
  preview?: string;
};

interface AnexosEvidenciasProps {
  uploadedFiles: UploadedFile[];
  handleFileUpload: (files: FileList | null) => void;
  assinaturaDataUrl: string | undefined;
  setAssinaturaDataUrl: (value: string | undefined) => void;
}

export function AnexosEvidencias(props: AnexosEvidenciasProps) {
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const modalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isModalDrawing, setIsModalDrawing] = useState(false);
  const [modalCanvasWidth, setModalCanvasWidth] = useState<number>(() =>
    typeof window !== "undefined" ? Math.min(Math.max(280, window.innerWidth - 40), 900) : 800
  );

  useEffect(() => {
    if (!signatureModalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const preventTouch = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest && target.closest(".modal-content-canvas-block")) {
        if (e.cancelable) e.preventDefault();
      }
    };
    document.addEventListener("touchmove", preventTouch, { passive: false });
    const updateSize = () => {
      const w = typeof window !== "undefined" ? Math.min(Math.max(280, window.innerWidth - 40), 900) : modalCanvasWidth;
      setModalCanvasWidth(w);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("touchmove", preventTouch);
      window.removeEventListener("resize", updateSize);
    };
  }, [signatureModalOpen]);

  const startDrawing = (e: any) => {
    try {
      e.preventDefault();
    } catch { /* noop */ }
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    try {
      if (typeof e.pointerId === "number" && canvas.setPointerCapture) {
        canvas.setPointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }
    setIsDrawing(true);
    const { x, y } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: any) => {
    try {
      e.preventDefault();
    } catch {
      // noop
    }
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCoordinates(e, canvas);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const endDrawing = (e?: any) => {
    try {
      if (e && typeof e.pointerId === "number" && signatureCanvasRef.current?.releasePointerCapture) {
        signatureCanvasRef.current.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }

    // salvar dataURL ao terminar de desenhar no canvas principal
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      try {
        const ctx = canvas.getContext("2d");
        let hasContent = false;
        if (ctx) {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          // verificar alpha de pixels para evitar canvas "em branco"
          for (let i = 3; i < imgData.data.length; i += 4) {
            if (imgData.data[i] !== 0) {
              hasContent = true;
              break;
            }
          }
        }
        if (hasContent) {
          const dataURL = canvas.toDataURL("image/png");
          props.setAssinaturaDataUrl(dataURL);
        } else {
          // se estiver vazio, garantir que o state não mantenha uma antiga assinatura
          props.setAssinaturaDataUrl(undefined);
        }
      } catch (err) {
        console.warn("Erro ao extrair assinatura do canvas:", err);
      }
    }

    setIsDrawing(false);
  };

  const getCoordinates = (e: any, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if (typeof e.clientX === "number" && typeof e.clientY === "number") {
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    if (e.changedTouches && e.changedTouches.length > 0) {
      return {
        x: e.changedTouches[0].clientX - rect.left,
        y: e.changedTouches[0].clientY - rect.top,
      };
    }
    return { x: 0, y: 0 };
  };

  const startModalDrawing = (e: any) => {
    try {
      e.preventDefault();
    } catch { /* noop */ }
    const modal = modalCanvasRef.current;
    if (!modal) return;
    const ctx = modal.getContext("2d");
    if (!ctx) return;
    try {
      if (typeof e.pointerId === "number" && modal.setPointerCapture) {
        modal.setPointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }
    setIsModalDrawing(true);
    const { x, y } = getCoordinates(e, modal);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const drawModal = (e: any) => {
    try {
      e.preventDefault();
    } catch { /* noop */ }
    if (!isModalDrawing || !modalCanvasRef.current) return;
    const modal = modalCanvasRef.current;
    const ctx = modal.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCoordinates(e, modal);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const endModalDrawing = (e?: any) => {
    try {
      const modal = modalCanvasRef.current;
      if (e && typeof e.pointerId === "number" && modal?.releasePointerCapture) {
        modal.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }
    setIsModalDrawing(false);
  };

  const clearModalSignature = () => {
    const modal = modalCanvasRef.current;
    if (!modal) return;
    const ctx = modal.getContext("2d");
    ctx?.clearRect(0, 0, modal.width, modal.height);
  };

  const saveModalSignature = async () => {
    const modal = modalCanvasRef.current;
    if (!modal) return;
    try {
      const dataURL = modal.toDataURL("image/png");
      if (signatureCanvasRef.current) {
        const mainCanvas = signatureCanvasRef.current;
        const mainCtx = mainCanvas.getContext("2d");
        if (mainCtx) {
          mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
          const img = new Image();
          img.onload = () => {
            mainCtx.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height);
            props.setAssinaturaDataUrl(dataURL);
          };
          img.src = dataURL;
        } else {
          props.setAssinaturaDataUrl(dataURL);
        }
      } else {
        props.setAssinaturaDataUrl(dataURL);
      }
      alert("Assinatura aplicada ao formulário (salva localmente). Será enviada ao salvar a ocorrência.");
    } catch (err) {
      console.error("Erro ao salvar assinatura do modal:", err);
      alert("Falha ao salvar assinatura do modal.");
    } finally {
      setSignatureModalOpen(false);
    }
  };

  function clearSignature() {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    props.setAssinaturaDataUrl(undefined);
  }

  return (
    <BoxInfo>
      <SectionTitle><PaperclipIcon size={22} weight="fill" /> Anexos e Evidências</SectionTitle>
      <SectionSubtitle>Fotos e Arquivos</SectionSubtitle>
      <UploadArea
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const files = e.dataTransfer.files;
          props.handleFileUpload(files);
        }}
      >
        <p>Arraste arquivos aqui ou clique para selecionar</p>
        <input
          type="file"
          accept="image/*,application/pdf"
          multiple
          capture="environment"
          onChange={(e) => props.handleFileUpload(e.target.files)}
        />
      </UploadArea>
      {props.uploadedFiles.length > 0 && (
        <PreviewList>
          {props.uploadedFiles.map((f, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span>{f.name}</span>
              {f.url ? (
                <a href={f.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8 }}>
                  Visualizar
                </a>
              ) : f.preview ? (
                <a href={f.preview} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8 }}>
                  Visualizar (local)
                </a>
              ) : (
                <span style={{ marginLeft: 8, color: "#64748b" }}>Local — será enviado ao salvar</span>
              )}
            </div>
          ))}
        </PreviewList>
      )}
      <Divider />
      <SectionSubtitle>Assinatura do Responsável</SectionSubtitle>
      <SignatureBox>
        <canvas
          ref={signatureCanvasRef}
          width={window.innerWidth < 480 ? 300 : 500}
          height={200}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={endDrawing}
          onPointerCancel={endDrawing}
        />
        <SignatureActions>
          <Button variant="secondary" text="Limpar" onClick={clearSignature} />
          <Button text="Abrir tela maior" onClick={() => setSignatureModalOpen(true)} />
        </SignatureActions>
      </SignatureBox>
      {signatureModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <div className="modal-content-canvas-block" style={{ width: "100%" }}>
              <canvas
                ref={modalCanvasRef}
                width={modalCanvasWidth}
                height={300}
                onPointerDown={startModalDrawing}
                onPointerMove={drawModal}
                onPointerUp={endModalDrawing}
                onPointerCancel={endModalDrawing}
                style={{ width: "100%", height: 300, display: "block" }}
              />
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: 12 }}>
              <Button variant="secondary" text="Limpar" onClick={clearModalSignature} />
              <Button text="Salvar" onClick={saveModalSignature} />
              <Button variant="secondary" text="Fechar" onClick={() => setSignatureModalOpen(false)} />
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </BoxInfo>
  );
}