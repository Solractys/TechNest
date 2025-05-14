"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type InterestButtonsProps = {
  eventId: string;
  userInterest: { id: string; status: string } | null;
  isEventPassed: boolean;
  isLoggedIn: boolean;
};

export default function InterestButtons({
  eventId,
  userInterest,
  isEventPassed,
  isLoggedIn,
}: InterestButtonsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  async function handleInterestChange(action: "add" | "remove") {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    console.log(`[InterestButtons] Iniciando ação: ${action} para evento: ${eventId}`);
    
    try {
      // Usamos POST para ambas as ações, apenas alterando o action no body
      console.log(`[InterestButtons] Enviando requisição POST para ${action} interesse`);
      const response = await fetch("/events/interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          status: action === "add" ? "INTERESTED" : undefined,
          action: action
        }),
      });
      
      console.log(`[InterestButtons] Resposta recebida: status=${response.status}, ok=${response.ok}`);

      if (!response.ok) {
        let errorMessage = `Erro ${response.status}: Ocorreu um erro ao processar sua solicitação`;
        
        console.log(`[InterestButtons] Resposta com erro: ${response.status} ${response.statusText}`);
        console.log('[InterestButtons] Headers recebidos:', Object.fromEntries([...response.headers.entries()]));
        
        try {
          const contentType = response.headers.get("content-type");
          console.log(`[InterestButtons] Content-Type: ${contentType}`);
          
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            console.log('[InterestButtons] Dados de erro:', errorData);
            errorMessage = errorData.error || errorMessage;
          } else {
            // Tentar ler o corpo da resposta como texto
            const textBody = await response.text();
            console.log('[InterestButtons] Corpo da resposta (texto):', textBody);
          }
        } catch (e) {
          console.error("[InterestButtons] Erro ao parsear resposta:", e);
        }
        
        throw new Error(errorMessage);
      }
      
      // Mostrar mensagem de sucesso e atualizar a página
      setSuccessMessage(action === "add" ? 
        "Interesse registrado com sucesso!" : 
        "Interesse removido com sucesso!");
        
      // Aguardar um curto período para exibir o feedback antes de atualizar
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      console.error("[InterestButtons] Erro ao atualizar interesse:", err);
      console.error("[InterestButtons] Mensagem de erro:", errorMessage);
    } finally {
      setIsLoading(false);
      console.log('[InterestButtons] Operação finalizada');
    }
  }

  if (isEventPassed) {
    return (
      <button
        className="w-full py-2 px-4 rounded bg-gray-200 text-gray-600 cursor-not-allowed"
        disabled
      >
        Evento encerrado
      </button>
    );
  }

  if (!isLoggedIn) {
    return (
      <Link
        href="/api/auth/signin"
        className="w-full btn btn-primary text-center block"
      >
        Faça login para ter interesse
      </Link>
    );
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="p-2 mb-3 text-sm text-red-800 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="p-2 mb-3 text-sm text-green-800 bg-green-100 rounded-md">
          {successMessage}
        </div>
      )}

      {userInterest ? (
        <>
          <button
            className="w-full btn btn-secondary"
            disabled={isLoading}
          >
            Você tem interesse neste evento
          </button>
          <button
            onClick={() => handleInterestChange("remove")}
            disabled={isLoading}
            className="w-full py-2 px-4 text-sm rounded border border-gray-300 hover:bg-gray-50"
          >
            {isLoading ? "Removendo..." : "Remover interesse"}
          </button>
        </>
      ) : (
        <button
          onClick={() => handleInterestChange("add")}
          disabled={isLoading}
          className="w-full btn btn-primary"
        >
          {isLoading ? "Processando..." : "Tenho interesse"}
        </button>
      )}
    </div>
  );
}