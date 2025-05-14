import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | TechNest.app",
  description:
    "Política de Privacidade do TechNest.app, detalhando como coletamos, usamos e protegemos seus dados pessoais.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Política de Privacidade
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Última atualização: 14 de maio de 2025
          </p>
        </div>

        <div className="prose prose-blue max-w-none">
          <h2>1. Introdução</h2>
          <p>
            Bem-vindo à Política de Privacidade do TechNest.app. Sua privacidade
            é importante para nós. Esta política descreve como coletamos,
            usamos, processamos e protegemos suas informações pessoais quando
            você utiliza nossa plataforma.
          </p>
          <p>
            Ao acessar ou usar o TechNest.app, você concorda com as práticas
            descritas nesta Política de Privacidade. Se você não concorda com
            esta política, por favor, não use nossa plataforma.
          </p>

          <h2>2. Informações que Coletamos</h2>
          <p>Podemos coletar os seguintes tipos de informações:</p>
          <ul>
            <li>
              <strong>Informações de Registro:</strong> Quando você cria uma
              conta, coletamos seu nome, endereço de e-mail, senha e,
              opcionalmente, foto de perfil.
            </li>
            <li>
              <strong>Informações de Perfil:</strong> Você pode optar por
              fornecer informações adicionais como interesses profissionais,
              empresa, cargo e links para redes sociais.
            </li>
            <li>
              <strong>Informações de Uso:</strong> Coletamos dados sobre como
              você interage com o TechNest.app, incluindo os eventos que você
              visualiza, favorita ou se inscreve.
            </li>
            <li>
              <strong>Informações do Dispositivo:</strong> Podemos coletar
              informações sobre seu dispositivo, como endereço IP, tipo de
              navegador, idioma e sistema operacional.
            </li>
            <li>
              <strong>Cookies e Tecnologias Similares:</strong> Usamos cookies e
              tecnologias similares para melhorar sua experiência, lembrar suas
              preferências e entender como você usa nossa plataforma.
            </li>
          </ul>

          <h2>3. Como Usamos Suas Informações</h2>
          <p>Utilizamos suas informações para os seguintes propósitos:</p>
          <ul>
            <li>Fornecer, manter e melhorar o TechNest.app</li>
            <li>Personalizar sua experiência e mostrar eventos relevantes</li>
            <li>
              Comunicar-nos com você sobre atualizações, novos recursos e
              eventos
            </li>
            <li>Processar inscrições em eventos e fornecer confirmações</li>
            <li>Proteger a segurança e integridade da plataforma</li>
            <li>Analisar o uso da plataforma para melhorar nossos serviços</li>
            <li>Cumprir obrigações legais</li>
          </ul>

          <h2>4. Compartilhamento de Informações</h2>
          <p>
            Podemos compartilhar suas informações nas seguintes circunstâncias:
          </p>
          <ul>
            <li>
              <strong>Com Organizadores de Eventos:</strong> Quando você se
              inscreve em um evento, compartilhamos informações básicas com o
              organizador para facilitar sua participação.
            </li>
            <li>
              <strong>Com Prestadores de Serviços:</strong> Podemos compartilhar
              informações com prestadores de serviços que nos ajudam a operar,
              desenvolver e melhorar o TechNest.app.
            </li>
            <li>
              <strong>Para Cumprimento Legal:</strong> Podemos divulgar
              informações se acreditarmos de boa-fé que isso é necessário para
              cumprir uma obrigação legal ou proteger direitos, propriedade ou
              segurança.
            </li>
            <li>
              <strong>Com Seu Consentimento:</strong> Podemos compartilhar suas
              informações com terceiros quando você der consentimento para tal.
            </li>
          </ul>

          <h2>5. Seus Direitos e Escolhas</h2>
          <p>
            Você tem certos direitos relacionados às suas informações pessoais:
          </p>
          <ul>
            <li>
              Acessar e atualizar suas informações de perfil a qualquer momento
            </li>
            <li>Optar por não receber comunicações de marketing</li>
            <li>Solicitar acesso às informações que temos sobre você</li>
            <li>Solicitar a exclusão de sua conta e dados associados</li>
            <li>Controlar as configurações de cookies em seu navegador</li>
          </ul>

          <h2>6. Segurança de Dados</h2>
          <p>
            Implementamos medidas de segurança técnicas e organizacionais
            adequadas para proteger suas informações pessoais contra acesso não
            autorizado, perda ou alteração. No entanto, nenhum método de
            transmissão pela Internet ou armazenamento eletrônico é 100% seguro,
            e não podemos garantir segurança absoluta.
          </p>

          <h2>7. Retenção de Dados</h2>
          <p>
            Mantemos suas informações pelo tempo necessário para fornecer os
            serviços que você solicitou, cumprir nossas obrigações legais ou
            conforme permitido por lei. Quando excluímos sua conta, podemos
            manter certas informações por um período limitado para fins legais
            ou de resolução de disputas.
          </p>

          <h2>8. Menores de Idade</h2>
          <p>
            O TechNest.app não é destinado a pessoas menores de 18 anos. Não
            coletamos intencionalmente informações pessoais de menores. Se
            soubermos que coletamos informações de um menor, tomaremos medidas
            para excluir essas informações.
          </p>

          <h2>9. Alterações nesta Política</h2>
          <p>
            Podemos atualizar esta Política de Privacidade periodicamente. Se
            fizermos alterações significativas, notificaremos você publicando um
            aviso no TechNest.app ou enviando um e-mail. Recomendamos que você
            revise esta política regularmente.
          </p>

          <h2>10. Contato</h2>
          <p>
            Se você tiver dúvidas ou preocupações sobre esta Política de
            Privacidade ou nossas práticas de dados, entre em contato conosco
            pelo e-mail:{" "}
            <a
              href="mailto:technestappcontact@gmail.com"
              className="text-primary-600 hover:text-primary-800"
            >
              technestappcontact@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
