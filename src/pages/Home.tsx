
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, Database, Users, Zap } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Navigation */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Mizi.app</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/personalization" className="text-gray-600 hover:text-indigo-600 transition-colors">
            Login
          </Link>
          <Button 
            asChild 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"
          >
            <Link to="/personalization">
              Começar agora
            </Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            Pare de ser ignorado. Comece a ser respondido.
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10">
            Mensagens personalizadas criadas em segundos. Mais reuniões agendadas. Menos dor de cabeça.
          </p>
          <Button 
            asChild 
            size="lg"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg px-8 py-6 rounded-full hover:opacity-90 shadow-lg"
          >
            <Link to="/personalization">
              Comece a personalizar agora
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-center mb-10">O problema atual</h2>
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <p className="text-2xl font-light text-center text-gray-700 mb-6">
                <span className="font-bold text-indigo-600">90% dos e-mails de prospecção</span> são ignorados porque soam genéricos.
              </p>
              <p className="text-xl text-center mb-6">
                Personalizar é obrigatório. Mas quem tem tempo pra isso?
              </p>
              <div className="flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Pessoa frustrada com e-mails"
                  className="rounded-lg w-full max-w-md h-auto"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-center mb-10">Como o Mizi resolve</h2>
            <p className="text-xl text-gray-700 text-center mb-10">
              O Mizi lê as informações públicas do seu prospect, entende o contexto, e cria mensagens alinhadas com o perfil e o momento dele — em segundos. 
              <br /><br />
              <span className="font-semibold">Você foca em vender, a gente cuida da copy.</span>
            </p>
            
            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-indigo-100 rounded-full mr-4">
                    <Zap className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Personalização instantânea</h3>
                </div>
                <p className="text-gray-700">Baseada em dados reais do seu prospect, não em templates genéricos.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-indigo-100 rounded-full mr-4">
                    <Calendar className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Mais reuniões agendadas</h3>
                </div>
                <p className="text-gray-700">Aumente sua taxa de resposta com mensagens que realmente engajam.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-indigo-100 rounded-full mr-4">
                    <Database className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Integração com CRM</h3>
                </div>
                <p className="text-gray-700">Funciona perfeitamente com seu CRM favorito, sem disrupções no seu fluxo.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-indigo-100 rounded-full mr-4">
                    <MessageSquare className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Soa humano, não robótico</h3>
                </div>
                <p className="text-gray-700">Nossas mensagens são treinadas para parecerem escritas por uma pessoa real.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-center mb-10">Perguntas frequentes</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-xl mb-3">Preciso treinar a ferramenta?</h3>
                <p className="text-gray-700">Não! O Mizi já vem pronto para entender seus prospects e gerar mensagens personalizadas desde o primeiro dia.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-xl mb-3">Consigo integrar com meu fluxo de cadência atual?</h3>
                <p className="text-gray-700">Sim! É plug and play. O Mizi foi desenvolvido para se encaixar em seu fluxo de trabalho atual sem exigir grandes mudanças.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-6">Sua próxima resposta começa com uma mensagem melhor.</h2>
            <p className="text-xl text-gray-700 mb-10">Teste o Mizi hoje e veja a diferença que mensagens verdadeiramente personalizadas podem fazer.</p>
            
            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg px-8 py-6 rounded-full hover:opacity-90 shadow-lg"
            >
              <Link to="/personalization">
                Personalize minha primeira mensagem
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Mizi.app</span>
          </div>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Mizi.app. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
