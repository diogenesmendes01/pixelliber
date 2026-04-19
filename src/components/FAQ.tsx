"use client";

import { useState } from "react";
import Link from "next/link";

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

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#121212] px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">
          Dúvidas mais frequentes
        </h2>
        <div className="space-y-2">
          {faqItems.map((item, index) => (
            <div key={index} className="rounded-md bg-zinc-800">
              <button
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between px-6 py-4 text-left text-lg font-medium transition hover:bg-zinc-700"
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
                <div className="px-6 pb-4 text-gray-300">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-gray-400">
          Alguma dúvida?{" "}
          <Link
            href="/contato"
            className="text-white underline transition hover:text-gray-300"
          >
            Contate-nos pelo formulário de contato.
          </Link>
        </p>
      </div>
    </section>
  );
}
