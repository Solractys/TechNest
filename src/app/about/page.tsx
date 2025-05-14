"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen text-slate-700">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sobre o TechNest
          </h1>
          <p className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto">
            Conectando a comunidade tech de São Paulo
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Missão</h2>
            <p className="text-lg text-gray-700 mb-6">
              O TechNest nasceu com uma missão clara: centralizar e facilitar o
              acesso aos eventos de tecnologia em São Paulo, criando um
              ecossistema vibrante para desenvolvedores, designers,
              empreendedores e entusiastas de tecnologia.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Em uma cidade tão dinâmica quanto São Paulo, com dezenas de
              eventos acontecendo simultaneamente, ficava difícil acompanhar
              todas as oportunidades de networking e aprendizado. O TechNest
              resolve esse problema, conectando organizadores e participantes em
              um único hub digital.
            </p>
          </div>
        </div>
      </section>

      {/* Creator Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Criador</h2>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mb-6 bg-gray-200 relative">
                <Image
                  src="https://media.licdn.com/dms/image/v2/D4D03AQFv0dRZMQpwwA/profile-displayphoto-shrink_200_200/B4DZXXyfp_HIAc-/0/1743082094108?e=1752710400&v=beta&t=2ezEDhB6NcEsuLzxk58__LGyLjlPMeAzZhXUbb7Vi5M"
                  alt="Carlos Lima - Criador do TechNest"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold">Carlos Lima</h3>
              <p className="text-primary-600 mb-4">Fundador & Desenvolvedor</p>
              <p className="text-gray-600 text-center max-w-2xl mt-2 mb-6">
                Desenvolvedor apaixonado por tecnologia e comunidades. Criei o
                TechNest com o objetivo de facilitar o acesso aos eventos de
                tecnologia em São Paulo e conectar pessoas da área tech.
              </p>
              <div className="flex space-x-4 mt-2">
                <a
                  href="https://github.com/Solractys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-600"
                >
                  <span className="sr-only">GitHub</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/carlos-eduardo-silva-souza-lima/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-600"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                {/* Removed Twitter link as it wasn't provided */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center">Valores</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-primary-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Comunidade</h3>
                <p className="text-gray-600">
                  Acredito no poder das comunidades para impulsionar a inovação
                  e o crescimento profissional.
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-primary-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Inovação</h3>
                <p className="text-gray-600">
                  Busco constantemente novas formas de melhorar a conexão entre
                  pessoas e eventos de tecnologia.
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-primary-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Confiabilidade</h3>
                <p className="text-gray-600">
                  Comprometo-me com informações precisas e atualizadas sobre
                  todos os eventos listados.
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-primary-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Inclusão</h3>
                <p className="text-gray-600">
                  Promovo um ambiente diverso e inclusivo para todos os membros
                  da comunidade tech.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section with Buy Me A Coffee Button */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Apoie o Projeto</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            Ajude a manter o TechNest funcionando e a desenvolver novos recursos
            para a comunidade tech de São Paulo. Seu café faz toda a diferença!
          </p>

          <div className="inline-block">
            <button
              className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
              // This will be replaced with Stripe integration in the future
              onClick={() => alert("Integração com Stripe em breve!")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Pague-me um Café</span>
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Em breve, os pagamentos serão processados de forma segura via
            Stripe, para que você possa apoiar este trabalho solo.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Perguntas Frequentes
            </h2>

            <div className="space-y-6">
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-2">
                  Como posso anunciar meu evento no TechNest?
                </h3>
                <p className="text-gray-600">
                  É simples! Basta criar uma conta gratuita e clicar em
                  "Organizar um evento" na página inicial. Siga as instruções
                  para adicionar todas as informações relevantes sobre seu
                  evento.
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-2">
                  O TechNest cobra alguma taxa para listar eventos?
                </h3>
                <p className="text-gray-600">
                  Não, listar seu evento no TechNest é totalmente gratuito.
                  Nosso objetivo é apoiar a comunidade tech, fornecendo uma
                  plataforma acessível para todos.
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-2">
                  Como posso entrar em contato com a equipe do TechNest?
                </h3>
                <p className="text-gray-600">
                  Você pode entrar em contato através do e-mail
                  technestappcontact@gmail.com ou pelo formulário de contato
                  disponível na plataforma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Faça parte da comunidade</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Junte-se a milhares de profissionais tech em São Paulo. Encontre
            eventos, conecte-se e aprenda com a comunidade.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/signup"
              className="btn bg-white text-primary-600 hover:bg-gray-100"
            >
              Criar conta gratuita
            </Link>
            <Link href="/events" className="btn btn-secondary">
              Explorar eventos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
