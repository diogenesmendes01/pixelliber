"use client";

import { useState } from "react";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";

const faqItems = [
  {
    question: "Recebi um boleto proposta, o que devo fazer?",
    answer:
      "Caso tenha recebido um boleto proposta, fique tranquilo. Trata-se de uma proposta comercial e não é obrigatório o pagamento. Caso não tenha interesse, basta descartá-lo.",
  },
  {
    question: "Paguei sem querer o boleto proposta, o que devo fazer?",
    answer:
      "Caso tenha pago o boleto proposta sem querer, entre em contato conosco o mais rápido possível. Você tem até 7 dias para solicitar o reembolso do valor pago.",
  },
];

export default function ContatoPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#121212] px-6 pt-28 pb-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            Entre em contato conosco
          </h1>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold">
              Dúvidas mais frequentes
            </h2>
            <div className="space-y-2">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  style={{ backgroundColor: "#252525", borderRadius: "5px" }}
                >
                  <button
                    onClick={() => toggle(index)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left text-lg font-medium transition hover:opacity-80"
                  >
                    <span>{item.question}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 shrink-0 transition-transform ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-4" style={{ color: "#C4BBBB" }}>
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contato */}
          <div
            style={{
              backgroundColor: "#252525",
              borderRadius: "15px",
              padding: "40px",
            }}
          >
            <h2 className="mb-6 text-2xl font-semibold">Contato</h2>
            <div
              className="mt-8 pt-6"
              style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
            >
              <p style={{ color: "#9A9A9A", fontSize: "13px" }}>
                <strong style={{ color: "#D4AF37" }}>PIXEL LIBER DIGITAL LTDA</strong>
                <br />
                CNPJ: 54.027.018/0001-06
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="#D4AF37"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a
                  href="mailto:financeiro@pixelliberdigital.com"
                  style={{ color: "#C4BBBB" }}
                  className="transition hover:text-white"
                >
                  financeiro@pixelliberdigital.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  className="h-5 w-5 fill-green-400"
                >
                  <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.914 15.914 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.608c-.39 1.1-1.932 2.014-3.164 2.282-.844.178-1.946.322-5.656-1.216-4.748-1.966-7.806-6.78-8.04-7.094-.226-.314-1.888-2.516-1.888-4.798s1.194-3.404 1.618-3.87c.39-.426.912-.62 1.218-.62.148 0 .28.008.4.014.424.018.636.042.916.71.35.834 1.204 2.934 1.31 3.148.106.214.212.504.066.79-.14.292-.264.422-.478.672-.214.25-.418.44-.632.712-.196.236-.416.488-.178.916.238.424 1.058 1.748 2.272 2.83 1.562 1.392 2.878 1.824 3.288 2.024.312.152.684.128.93-.128.31-.328.694-.87 1.084-1.406.278-.382.628-.43.97-.292.346.13 2.188 1.032 2.564 1.22.376.188.626.28.718.438.09.156.09.904-.302 2.004z" />
                </svg>
                <a
                  href="https://wa.me/5519971273953"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#C4BBBB" }}
                  className="transition hover:text-white"
                >
                  (19) 97127-3953
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
}
