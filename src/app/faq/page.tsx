import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perguntas Frequentes | TechNest.app",
  description:
    "Respostas para perguntas comuns sobre o TechNest.app, a plataforma de eventos tech em São Paulo.",
};

export default function FAQPage() {
  const faqItems = [
    {
      question: "O que é o TechNest?",
      answer:
        "O TechNest é uma plataforma que centraliza eventos de tecnologia em São Paulo. Nosso objetivo é conectar profissionais, estudantes e entusiastas de tecnologia com os melhores eventos do setor, tudo em um único lugar.",
    },
    {
      question: "Como posso criar uma conta no TechNest?",
      answer:
        "Para criar uma conta, clique no botão 'Criar conta' no canto superior direito da página. Você pode se cadastrar usando seu e-mail ou através de sua conta Google ou GitHub.",
    },
    {
      question: "A plataforma é gratuita?",
      answer:
        "Sim, o TechNest é totalmente gratuito para usuários que desejam descobrir e participar de eventos. Organizadores também podem listar seus eventos sem custos.",
    },
    {
      question: "Como posso anunciar meu evento no TechNest?",
      answer:
        "Para anunciar seu evento, faça login na sua conta e clique em 'Organizar um evento' na página inicial. Preencha o formulário com todas as informações relevantes sobre seu evento e publique-o na plataforma.",
    },
    {
      question: "Posso editar um evento depois de publicá-lo?",
      answer:
        "Sim, você pode editar qualquer detalhe do seu evento a qualquer momento. Basta acessar 'Meus Eventos' no seu perfil e selecionar o evento que deseja modificar.",
    },
    {
      question: "Como funcionam as categorias de eventos?",
      answer:
        "Os eventos são organizados em categorias para facilitar a busca. Algumas das categorias incluem Frontend, Backend, DevOps, Data Science, Mobile, Cloud, Security e AI/ML. Você pode navegar por eventos de uma categoria específica clicando em 'Categorias' no menu principal.",
    },
    {
      question: "É possível filtrar eventos por data ou formato?",
      answer:
        "Sim, na página de eventos você encontrará filtros para selecionar eventos por data (hoje, amanhã, esta semana, este mês) e por formato (presencial ou online).",
    },
    {
      question: "Como posso entrar em contato com o organizador de um evento?",
      answer:
        "Na página de detalhes do evento, você encontrará informações de contato do organizador, caso eles tenham disponibilizado. Muitos eventos também têm links para grupos de discussão ou canais de comunicação específicos.",
    },
    {
      question: "O TechNest oferece certificados de participação?",
      answer:
        "O TechNest não emite certificados diretamente. Certificados de participação são fornecidos pelos organizadores dos eventos, caso disponíveis.",
    },
    {
      question:
        "Como posso me inscrever para receber notificações sobre novos eventos?",
      answer:
        "Ao criar uma conta no TechNest, você pode personalizar suas preferências de notificação no seu perfil. Você pode optar por receber atualizações sobre novas adições de eventos em categorias específicas que sejam do seu interesse.",
    },
    {
      question:
        "O TechNest está disponível em outras cidades além de São Paulo?",
      answer:
        "Atualmente, o TechNest está focado em eventos de tecnologia em São Paulo. No futuro, planejamos expandir para outras cidades e regiões.",
    },
    {
      question: "Como reportar um problema ou sugerir uma melhoria?",
      answer:
        "Seus feedbacks são muito importantes para nós. Se encontrar um problema ou tiver uma sugestão, envie um e-mail para contato@technest.app.",
    },
  ];

  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Perguntas Frequentes
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Encontre respostas para as perguntas mais comuns sobre o TechNest
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {faqItems.map((item, index) => (
            <div key={index} className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {item.question}
              </h2>
              <p className="text-gray-600">{item.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Ainda tem dúvidas?
          </h2>
          <p className="text-gray-600 mb-4">
            Se você não encontrou a resposta para sua pergunta, entre em contato
            conosco por e-mail.
          </p>
          <a
            href="mailto:technestappcontact@gmail.com"
            className="text-primary-600 hover:text-primary-800 font-medium"
          >
            technestappcontact@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
