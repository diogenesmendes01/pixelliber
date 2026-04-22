"use client";

import { useState } from "react";

const faqItems = [
  {
    question: "Como funciona o acesso para minha empresa?",
    answer:
      "Você cadastra sua empresa com o CNPJ e escolhe um plano. Após a confirmação, o administrador recebe as credenciais iniciais (CNPJ como usuário e senha) e pode convidar os funcionários via e-mail.",
  },
  {
    question: "Posso ler os e-books sem conexão à internet?",
    answer:
      "Sim. Os planos Standard e Pro incluem leitura offline por 30 dias. Basta abrir o livro com conexão pelo menos uma vez para armazená-lo no seu dispositivo.",
  },
  {
    question: "Como adiciono ou removo funcionários?",
    answer:
      "No painel de Equipe, o administrador envia convites por e-mail. O funcionário recebe o link, cria a própria senha e já tem acesso ao acervo. Para remover, basta clicar em 'Remover' na lista de membros.",
  },
  {
    question: "O que acontece se eu ultrapassar o limite de licenças?",
    answer:
      "Você não consegue convidar mais pessoas do que o plano permite. Para adicionar mais membros, basta fazer upgrade para um plano com mais licenças — sem perder nenhum dado.",
  },
  {
    question: "Recebi um boleto proposta, o que devo fazer?",
    answer:
      "Trata-se de uma proposta comercial, não é obrigatório o pagamento. Caso não tenha interesse, basta descartá-lo. Dúvidas? Entre em contato conosco.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section" id="faq">
      <div className="container">
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <span className="tag gold-text">FAQ</span>
          <h2
            className="serif"
            style={{ fontSize: "var(--h2)", margin: "10px 0 32px", fontWeight: 500 }}
          >
            Dúvidas frequentes
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {faqItems.map((item, index) => (
              <div
                key={index}
                style={{
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  style={{
                    background: "none",
                    border: 0,
                    color: "var(--paper)",
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 0",
                    textAlign: "left",
                    fontSize: "var(--fs-md)",
                    fontWeight: 500,
                    gap: 12,
                    cursor: "pointer",
                  }}
                >
                  <span>{item.question}</span>
                  <span
                    style={{
                      flexShrink: 0,
                      opacity: 0.5,
                      transition: "transform .2s",
                      transform: openIndex === index ? "rotate(180deg)" : "none",
                    }}
                  >
                    ↓
                  </span>
                </button>
                {openIndex === index && (
                  <div
                    style={{
                      paddingBottom: 16,
                      color: "rgba(247,245,240,0.65)",
                      fontSize: "var(--fs-sm)",
                      lineHeight: 1.65,
                    }}
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <p style={{ marginTop: 32, fontSize: 13, color: "var(--muted)" }}>
            Outra dúvida?{" "}
            <a href="/contato" style={{ color: "var(--gold)", fontWeight: 500 }}>
              Fale conosco →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
